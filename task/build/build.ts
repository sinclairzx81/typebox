/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import * as Path from 'node:path'
import * as Task from '../task.ts'
import { removeNotice } from './remove-notice.ts'

export type BuildOptions = {
  target: string
  compiler: string
  additional: string[]
  packageJson: Record<string, unknown> & { name: string; version: string }
}
// -------------------------------------------------------------------
// CreatePackageJson
// -------------------------------------------------------------------
function createPackageJson(metadata: BuildOptions['packageJson'], entrypoints: string[]) {
  const exports = Object.fromEntries([
    ...entrypoints.map((name) => [`./${name}`, {
      import: `./build/${name}/index.mjs`,
      default: `./build/${name}/index.mjs`
    }]),
    ['.', { import: './build/index.mjs', default: './build/index.mjs' }]
  ])
  const typesVersions = {
    '*': Object.fromEntries([
      ...entrypoints.map((name) => [name, [`./build/${name}/index.d.mts`]]),
      ['.', ['./build/index.d.mts']]
    ])
  }
  return {
    ...metadata,
    type: 'module',
    types: './build/index.d.mts',
    module: './build/index.mjs',
    exports,
    typesVersions
  }
}
// -------------------------------------------------------------------
// DiscoverSources
// -------------------------------------------------------------------
async function discoverSources(sourceDirectory: string): Promise<{ files: string[]; entrypoints: string[] }> {
  const files = (await Task.readDirectoryRecursive(sourceDirectory)).filter((file) => file.endsWith('.ts')).sort()
  const entrypoints = files
    .map((file) => Path.relative(sourceDirectory, file))
    .filter((file) => Path.basename(file) === 'index.ts')
    .map((file) => Path.dirname(file))
    .filter((directory) => directory !== '.' && !directory.includes(Path.sep))
    .sort()
  return { files, entrypoints }
}
// -------------------------------------------------------------------
// PrepareBuild
// -------------------------------------------------------------------
async function prepareBuild(stagingDirectory: string, buildDirectory: string): Promise<void> {
  await Task.remove(buildDirectory)
  await Task.remove(stagingDirectory)
  await Task.createDir(stagingDirectory)
  await Task.createDir(buildDirectory)
}
// -------------------------------------------------------------------
// CopySourcesToStaging
// -------------------------------------------------------------------
async function copySourcesToStaging(sourceDirectory: string, sourceFiles: string[], stagingDirectory: string): Promise<string[]> {
  const stagingFiles: string[] = []
  for (const sourceFile of sourceFiles) {
    const stagingFile = Path.join(stagingDirectory, Path.relative(sourceDirectory, sourceFile).replace(/\.ts$/, '.mts'))
    const contents = removeNotice(await Task.read(sourceFile)).replace(/\.ts(?=['"])/g, '.mjs')
    await Task.write(stagingFile, contents)
    stagingFiles.push(stagingFile)
  }
  return stagingFiles
}
// -------------------------------------------------------------------
// WriteCompilerConfig
// -------------------------------------------------------------------
async function writeCompilerConfig(stagingDirectory: string, stagingFiles: string[]): Promise<string> {
  const config = Path.join(stagingDirectory, 'tsconfig.json')
  await Task.write(config, JSON.stringify({
    compilerOptions: {
      strict: true,
      target: 'ES2020',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      declaration: true,
      skipLibCheck: true,
      rootDir: '.'
    },
    files: stagingFiles.map((file) => Path.relative(stagingDirectory, file).replaceAll(Path.sep, '/'))
  }, null, 2))
  return config
}
// -------------------------------------------------------------------
// CompilePackage
// -------------------------------------------------------------------
async function compilePackage(config: string, output: string, compilerVersion: string): Promise<void> {
  const relativeConfig = Path.relative(process.cwd(), config)
  const relativeOutput = Path.relative(process.cwd(), output)
  await Task.tsc(compilerVersion, `--project ${JSON.stringify(relativeConfig)} --outDir ${JSON.stringify(relativeOutput)} --declaration`)
}
// -------------------------------------------------------------------
// WritePackage
// -------------------------------------------------------------------
async function writePackage(buildDirectory: string, metadata: BuildOptions['packageJson'], entrypoints: string[], additional: string[]): Promise<void> {
  for (const file of additional) await Task.copy(file, Path.join(buildDirectory, file))
  await Task.write(Path.join(buildDirectory, 'package.json'), JSON.stringify(createPackageJson(metadata, entrypoints), null, 2))
}
// -------------------------------------------------------------------
// PackPackage
// -------------------------------------------------------------------
async function packPackage(buildDirectory: string): Promise<void> {
  await Task.shell('npm pack --pack-destination .', buildDirectory)
}
// -------------------------------------------------------------------
// CheckPackage
// -------------------------------------------------------------------
async function checkPackage(buildDirectory: string, metadata: BuildOptions['packageJson']): Promise<void> {
  const name = metadata.name.replace(/^@/, '').replace('/', '-')
  const archive = `${name}-${metadata.version}.tgz`
  await Task.shell(`attw ${JSON.stringify(archive)} --profile esm-only --ignore-rules no-resolution cjs-resolves-to-esm`, buildDirectory)
}
// -------------------------------------------------------------------
// CleanStaging
// -------------------------------------------------------------------
async function cleanStaging(stagingDirectory: string): Promise<void> {
  await Task.remove(stagingDirectory)
}
// -------------------------------------------------------------------
// BuildPackage
// -------------------------------------------------------------------
export async function build(sourceDirectory: string, options: BuildOptions): Promise<void> {
  console.log(`Using TypeScript ${options.compiler}`)
  const buildDirectory = options.target
  const stagingDirectory = Path.resolve(Path.dirname(buildDirectory), 'staging')
  const buildOutputDirectory = Path.resolve(buildDirectory, 'build')
  const { files: sourceFiles, entrypoints } = await discoverSources(sourceDirectory)
  try {
    await prepareBuild(stagingDirectory, buildDirectory)
    const stagingFiles = await copySourcesToStaging(sourceDirectory, sourceFiles, stagingDirectory)
    const config = await writeCompilerConfig(stagingDirectory, stagingFiles)
    await compilePackage(config, buildOutputDirectory, options.compiler)
    await writePackage(buildDirectory, options.packageJson, entrypoints, options.additional)
    await packPackage(buildDirectory)
    await checkPackage(buildDirectory, options.packageJson)
  } finally {
    await cleanStaging(stagingDirectory)
  }
}

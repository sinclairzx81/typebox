import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { readFileSync, readdirSync, watch as watchFiles } from 'node:fs'
import { createServer, type ServerResponse } from 'node:http'
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { gzipSync } from 'node:zlib'
import { build as esbuild } from 'esbuild'
import { execa } from 'execa'

type TaskCallback = (...args: string[]) => unknown | Promise<unknown>
type PackageMetadata = {
  name: string
  description: string
  version: string
  keywords: string[]
  license: string
  author: string
  repository: { type: string; url: string }
}
type WalkEntry = { path: string; name: string; isDirectory: boolean; isFile: boolean }

const tasks = new Map<string, TaskCallback>()

export function run(name: string, callback: TaskCallback): void {
  tasks.set(name, callback)
}

export async function execute(): Promise<void> {
  const [name, ...args] = process.argv.slice(2)
  if (name === undefined) throw new Error(`Expected task name. Available tasks: ${[...tasks.keys()].join(', ')}`)
  const callback = tasks.get(name)
  if (callback === undefined) throw new Error(`Unknown task '${name}'. Available tasks: ${[...tasks.keys()].join(', ')}`)
  console.time(name)
  try {
    await callback(...args)
  } finally {
    console.timeEnd(name)
  }
}

export async function shell(command: string, args: string[] = [], cwd: string = process.cwd()): Promise<void> {
  await execa(command, args, { cwd, stdio: 'inherit' })
}

export async function entries(directory: string): Promise<WalkEntry[]> {
  const values = await readdir(directory, { withFileTypes: true })
  return values.map((value) => ({
    path: join(directory, value.name),
    name: value.name,
    isDirectory: value.isDirectory(),
    isFile: value.isFile()
  }))
}

export function entriesSync(directory: string): WalkEntry[] {
  return readdirSync(directory, { withFileTypes: true }).map((value) => ({
    path: join(directory, value.name),
    name: value.name,
    isDirectory: value.isDirectory(),
    isFile: value.isFile()
  }))
}

export async function walk(directory: string): Promise<string[]> {
  const result: string[] = []
  for (const entry of await entries(directory)) {
    if (entry.isDirectory) result.push(...await walk(entry.path))
    else if (entry.isFile) result.push(entry.path)
  }
  return result
}

export function readSync(path: string): string {
  return readFileSync(path, 'utf8')
}

export async function read(path: string): Promise<string> {
  return await readFile(path, 'utf8')
}

export async function createDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true })
}

export async function write(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content)
}

export async function remove(path: string): Promise<void> {
  await rm(path, { recursive: true, force: true })
}

export async function copy(source: string, target: string): Promise<void> {
  await mkdir(dirname(target), { recursive: true })
  await cp(source, target, { recursive: true, force: true })
}

function contentType(path: string): string {
  switch (extname(path)) {
    case '.css': return 'text/css; charset=utf-8'
    case '.html': return 'text/html; charset=utf-8'
    case '.ico': return 'image/x-icon'
    case '.js': return 'text/javascript; charset=utf-8'
    case '.json': return 'application/json; charset=utf-8'
    case '.png': return 'image/png'
    case '.svg': return 'image/svg+xml'
    case '.ttf': return 'font/ttf'
    default: return 'application/octet-stream'
  }
}

export async function serve(directory: string = '.', port: number = 5000): Promise<void> {
  const root = resolve(directory)
  const reloadPath = '/__reload'
  const clients = new Set<ServerResponse>()
  const server = createServer((request, response) => {
    let pathname: string
    try {
      pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
    } catch {
      response.writeHead(400).end('Bad request')
      return
    }
    if (pathname === reloadPath) {
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream'
      })
      response.write(': connected\n\n')
      clients.add(response)
      response.on('close', () => clients.delete(response))
      return
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405).end('Method not allowed')
      return
    }
    let filePath = resolve(root, pathname === '/' ? 'index.html' : `.${pathname}`)
    const relativePath = relative(root, filePath)
    if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
      response.writeHead(403).end('Forbidden')
      return
    }
    void (async () => {
      if ((await stat(filePath)).isDirectory()) filePath = resolve(filePath, 'index.html')
      let body: Buffer | string = await readFile(filePath)
      if (extname(filePath) === '.html') {
        body = body.toString().replace(
          /<\/body>/i,
          `<script>new EventSource('${reloadPath}').onmessage=()=>location.reload()</script></body>`
        )
      }
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': contentType(filePath)
      })
      response.end(request.method === 'HEAD' ? undefined : body)
    })().catch((error: unknown) => {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        response.writeHead(404).end('Not found')
      } else {
        console.error('Static server error:', error)
        response.writeHead(500).end('Internal server error')
      }
    })
  })
  let reloadTimer: ReturnType<typeof setTimeout> | undefined
  const watcher = watchFiles(root, { recursive: true }, () => {
    if (reloadTimer !== undefined) clearTimeout(reloadTimer)
    reloadTimer = setTimeout(() => {
      for (const client of clients) client.write('data: reload\n\n')
    }, 250)
  })
  watcher.on('error', (error) => console.error('Static server watcher error:', error))
  const stop = () => {
    watcher.close()
    for (const client of clients) client.end()
    clients.clear()
    server.close()
  }
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  try {
    await new Promise<void>((resolveListen, rejectListen) => {
      const onError = (error: Error) => rejectListen(error)
      server.once('error', onError)
      server.listen(port, '127.0.0.1', () => {
        server.off('error', onError)
        server.on('error', (error) => console.error('Static server error:', error))
        resolveListen()
      })
    })
    const address = server.address()
    const listeningPort = address !== null && typeof address !== 'string' ? address.port : port
    console.log(`Serving ${root} at http://localhost:${listeningPort}`)
    await new Promise<void>((resolveClose) => server.once('close', resolveClose))
  } finally {
    if (reloadTimer !== undefined) clearTimeout(reloadTimer)
    watcher.close()
    process.off('SIGINT', stop)
    process.off('SIGTERM', stop)
  }
}

function packageJson(metadata: PackageMetadata) {
  const exports = Object.fromEntries([
    'compile',
    'error',
    'format',
    'guard',
    'schema',
    'system',
    'type',
    'value'
  ].map((name) => [`./${name}`, {
    import: `./build/${name}/index.mjs`,
    default: `./build/${name}/index.mjs`
  }]))
  exports['.'] = { import: './build/index.mjs', default: './build/index.mjs' }
  const typesVersions = Object.fromEntries([
    'compile',
    'error',
    'format',
    'guard',
    'schema',
    'system',
    'type',
    'value'
  ].map((name) => [name, [`./build/${name}/index.d.mts`]]))
  typesVersions['.'] = ['./build/index.d.mts']
  return {
    ...metadata,
    type: 'module',
    types: './build/index.d.mts',
    module: './build/index.mjs',
    exports,
    typesVersions
  }
}

export async function buildPackage(source: string, target: string, metadata: PackageMetadata): Promise<void> {
  const staging = resolve(`${target}.staging`)
  const stagedSource = join(staging, 'src')
  const output = resolve(target, 'build')
  const files = (await walk(source)).filter((file) => file.endsWith('.ts'))
  await remove(target)
  await remove(staging)
  await mkdir(stagedSource, { recursive: true })
  try {
    const stagedFiles: string[] = []
    for (const file of files) {
      const destination = join(stagedSource, relative(source, file).replace(/\.ts$/, '.mts'))
      const contents = (await read(file)).replace(/\.ts(?=['"])/g, '.mjs')
      await write(destination, contents)
      stagedFiles.push(destination)
    }
    const config = join(staging, 'tsconfig.json')
    await write(config, JSON.stringify({
      compilerOptions: {
        strict: true,
        target: 'ES2020',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        declaration: true,
        skipLibCheck: true,
        rootDir: stagedSource
      },
      files: stagedFiles
    }, null, 2))
    await mkdir(target, { recursive: true })
    await shell('npm', [
      'exec',
      '--yes',
      '--package=typescript@7.0.2',
      '--',
      'tsc',
      '--project',
      config,
      '--outDir',
      output,
      '--declaration'
    ])
    await copy('license', join(target, 'license'))
    await copy('readme.md', join(target, 'readme.md'))
    await write(join(target, 'package.json'), JSON.stringify(packageJson(metadata), null, 2))
    await shell('npm', ['pack', '--pack-destination', '.'], target)
    const archive = `${metadata.name}-${metadata.version}.tgz`
    await shell('attw', [
      archive,
      '--profile',
      'esm-only',
      '--ignore-rules',
      'no-resolution',
      'cjs-resolves-to-esm'
    ], target)
  } finally {
    await remove(staging)
  }
}

async function testFiles(roots: string[]): Promise<string[]> {
  const result: string[] = []
  for (const root of roots) {
    for (const file of await walk(root)) {
      const name = file.slice(file.lastIndexOf(sep) + 1)
      if (file.endsWith('.ts') && !name.startsWith('_')) result.push(resolve(file))
    }
  }
  return result.sort()
}

export async function writeTestManifest(roots: string[], manifest: string): Promise<string> {
  const base = dirname(resolve(manifest))
  const imports = (await testFiles(roots)).map((file) => {
    let specifier = relative(base, file).split(sep).join('/')
    if (!specifier.startsWith('.')) specifier = `./${specifier}`
    return `import '${specifier}'`
  })
  await write(manifest, imports.join('\n'))
  return resolve(manifest)
}

export async function test(roots: string[], options: { filter?: string; watch?: boolean } = {}): Promise<void> {
  const manifest = await writeTestManifest(roots, 'target/test/manifest.ts')
  const args = ['--experimental-transform-types', '--test']
  if (options.watch) args.push('--watch')
  if (options.filter) args.push(`--test-name-pattern=${options.filter}`)
  args.push(manifest)
  await shell(process.execPath, args)
}

export async function report(roots: string[]): Promise<void> {
  const manifest = await writeTestManifest(roots, 'target/report/manifest.ts')
  const c8 = resolve('node_modules/c8/bin/c8.js')
  await shell(process.execPath, [
    c8,
    '--reporter=text',
    '--reporter=html',
    '--reports-dir=target/report/output/html',
    '--temp-directory=target/report/output/raw',
    process.execPath,
    '--experimental-transform-types',
    '--test',
    manifest
  ])
  console.log('HTML coverage report: target/report/output/html/index.html')
}

export async function compiler(version: string, args: string[]): Promise<void> {
  await shell('npm', [
    'exec',
    '--yes',
    `--package=typescript@${version}`,
    '--',
    'tsc',
    ...args
  ])
}

function formatSize(size: number): string {
  return `${(size / 1024).toFixed(2)} KB`
}

export async function metrics(entries: string[]): Promise<void> {
  const target = 'target/metrics'
  await remove(target)
  await mkdir(target, { recursive: true })
  const results = await Promise.all(entries.map(async (entry) => {
    const filename = basename(entry)
    const [bundle, minified] = await Promise.all([
      esbuild({ entryPoints: [entry], bundle: true, platform: 'browser', write: false, metafile: true }),
      esbuild({ entryPoints: [entry], bundle: true, platform: 'browser', minify: true, write: false, metafile: true })
    ])
    const bundleOutput = bundle.outputFiles[0]
    const minifiedOutput = minified.outputFiles[0]
    if (bundleOutput === undefined || minifiedOutput === undefined) throw new Error(`No bundle output produced for ${entry}`)
    await write(join(target, `${filename}-bundle.meta.json`), JSON.stringify(bundle.metafile, null, 2))
    await write(join(target, `${filename}-minified.meta.json`), JSON.stringify(minified.metafile, null, 2))
    return {
      path: entry,
      bundled: formatSize(bundleOutput.contents.length),
      minified: formatSize(minifiedOutput.contents.length),
      gzipped: formatSize(gzipSync(minifiedOutput.contents).length)
    }
  }))
  console.table(results)
  console.log('')
  console.log('  visit: https://esbuild.github.io/analyze/ for metafile analysis')
  console.log('')
}

export const Path = { basename, dirname, join, relative, resolve }

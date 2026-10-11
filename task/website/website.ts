import { watch } from 'node:fs'
import { resolve } from 'node:path'
import { context as esbuildContext, type BuildContext } from 'esbuild'
import { marked } from 'marked'
import * as Task from '../task.ts'

interface Manifest {
  [dir: string]: { [file: string]: string }
}

async function processDir(srcRoot: string, srcDir: string, targetDir: string, manifest: Manifest): Promise<void> {
  const contents = (await Task.entries(srcDir)).sort((a, b) => a.name.localeCompare(b.name))
  for (const entry of contents) {
    const srcPath = entry.path
    if (entry.isDirectory) {
      await processDir(srcRoot, srcPath, targetDir, manifest)
    } else if (entry.isFile && entry.name.endsWith('.md')) {
      const html = await marked(await Task.read(srcPath), { gfm: true })
      const dirName = Task.Path.relative(srcRoot, Task.Path.dirname(srcPath))
      const fileName = Task.Path.basename(entry.name).replace(/\.md$/, '')
      const htmlPath = Task.Path.join(dirName, `${fileName}.html`).replaceAll('\\', '/')
      const targetPath = Task.Path.join(targetDir, htmlPath)
      const sectionName = Task.Path.basename(dirName)
      const documentName = Task.Path.basename(htmlPath).replace(/\.html$/, '')
      manifest[sectionName] ??= {}
      manifest[sectionName][documentName] = htmlPath
      await Task.write(targetPath, html)
    }
  }
}

export async function BuildDocs(
  srcDirectory: string = 'design/website',
  targetDirectory: string = 'docs'
): Promise<void> {
  await Task.remove(Task.Path.join(targetDirectory, 'docs'))
  await Task.remove(Task.Path.join(targetDirectory, 'resources'))
  await Task.remove(Task.Path.join(targetDirectory, 'manifest.json'))
  await Task.copy(Task.Path.join(srcDirectory, 'resources'), Task.Path.join(targetDirectory, 'resources'))
  const manifest: Manifest = {}
  await processDir(srcDirectory, Task.Path.join(srcDirectory, 'docs'), targetDirectory, manifest)
  await Task.write(Task.Path.join(targetDirectory, 'manifest.json'), JSON.stringify(manifest, null, 2))
}

async function createBundle(srcDirectory: string, targetDirectory: string): Promise<BuildContext> {
  const context = await esbuildContext({
    entryPoints: [resolve(srcDirectory, 'app/index.tsx')],
    bundle: true,
    minify: true,
    platform: 'browser',
    format: 'esm',
    outfile: resolve(targetDirectory, 'index.js')
  })
  try {
    await context.rebuild()
    return context
  } catch (error) {
    await context.dispose()
    throw error
  }
}

async function prepareWebsite(srcDirectory: string, targetDirectory: string): Promise<BuildContext> {
  await Task.remove(targetDirectory)
  await Task.createDir(targetDirectory)
  await BuildDocs(srcDirectory, targetDirectory)
  await Task.copy(Task.Path.join(srcDirectory, 'index.html'), Task.Path.join(targetDirectory, 'index.html'))
  return await createBundle(srcDirectory, targetDirectory)
}

export async function Website(
  srcDirectory: string = 'design/website',
  targetDirectory: string = 'docs',
  port: number = 5000
): Promise<void> {
  const context = await prepareWebsite(srcDirectory, targetDirectory)
  let rebuildTimer: ReturnType<typeof setTimeout> | undefined
  let rebuildChain = Promise.resolve()
  const watcher = watch(srcDirectory, { recursive: true }, () => {
    if (rebuildTimer !== undefined) clearTimeout(rebuildTimer)
    rebuildTimer = setTimeout(() => {
      rebuildChain = rebuildChain.then(async () => {
        await BuildDocs(srcDirectory, targetDirectory)
        await Task.copy(Task.Path.join(srcDirectory, 'index.html'), Task.Path.join(targetDirectory, 'index.html'))
      }).catch((error: unknown) => console.error('Website rebuild error:', error))
    }, 100)
  })
  try {
    await context.watch()
    await Task.serve(targetDirectory, port)
  } finally {
    if (rebuildTimer !== undefined) clearTimeout(rebuildTimer)
    watcher.close()
    await context.dispose()
  }
}

/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import * as Fs from 'node:fs'
import * as Path from 'node:path'
import * as Esbuild from 'esbuild'
import * as Marked from 'marked'
import * as Task from '../task.ts'

interface Manifest {
  [dir: string]: { [file: string]: string }
}
type DirectoryEntry = Awaited<ReturnType<typeof Task.readDirectory>>[number]
// -------------------------------------------------------------------
// CompareDirectoryEntries
// -------------------------------------------------------------------
function compareDirectoryEntries(a: DirectoryEntry, b: DirectoryEntry): number {
  return a.name.localeCompare(b.name)
}
// -------------------------------------------------------------------
// ProcessDir
// -------------------------------------------------------------------
async function processDir(srcRoot: string, srcDir: string, targetDir: string, manifest: Manifest): Promise<void> {
  const contents = (await Task.readDirectory(srcDir)).sort(compareDirectoryEntries)
  for (const entry of contents) {
    const srcPath = entry.path
    if (entry.isDirectory) {
      await processDir(srcRoot, srcPath, targetDir, manifest)
    } else if (entry.isFile && entry.name.endsWith('.md')) {
      const html = await Marked.marked(await Task.read(srcPath), { gfm: true })
      const dirName = Path.relative(srcRoot, Path.dirname(srcPath))
      const fileName = Path.basename(entry.name).replace(/\.md$/, '')
      const htmlPath = Path.join(dirName, `${fileName}.html`).replaceAll('\\', '/')
      const targetPath = Path.join(targetDir, htmlPath)
      const sectionName = Path.basename(dirName)
      const documentName = Path.basename(htmlPath).replace(/\.html$/, '')
      manifest[sectionName] ??= {}
      manifest[sectionName][documentName] = htmlPath
      await Task.write(targetPath, html)
    }
  }
}
// -------------------------------------------------------------------
// BuildDocs
// -------------------------------------------------------------------
export async function buildDocs(srcDirectory: string, targetDirectory: string): Promise<void> {
  await Task.remove(Path.join(targetDirectory, 'docs'))
  await Task.remove(Path.join(targetDirectory, 'resources'))
  await Task.remove(Path.join(targetDirectory, 'manifest.json'))
  await Task.copy(Path.join(srcDirectory, 'resources'), Path.join(targetDirectory, 'resources'))
  const manifest: Manifest = {}
  await processDir(srcDirectory, Path.join(srcDirectory, 'docs'), targetDirectory, manifest)
  await Task.write(Path.join(targetDirectory, 'manifest.json'), JSON.stringify(manifest, null, 2))
}
// -------------------------------------------------------------------
// CreateBundle
// -------------------------------------------------------------------
async function createBundle(srcDirectory: string, targetDirectory: string): Promise<Esbuild.BuildContext> {
  const context = await Esbuild.context({
    entryPoints: [Path.resolve(srcDirectory, 'app/index.tsx')],
    bundle: true,
    minify: true,
    platform: 'browser',
    format: 'esm',
    outfile: Path.resolve(targetDirectory, 'index.js')
  })
  try {
    await context.rebuild()
    return context
  } catch (error) {
    await context.dispose()
    throw error
  }
}
// -------------------------------------------------------------------
// PrepareWebsite
// -------------------------------------------------------------------
async function prepareWebsite(srcDirectory: string, targetDirectory: string): Promise<Esbuild.BuildContext> {
  await Task.remove(targetDirectory)
  await Task.createDir(targetDirectory)
  await buildDocs(srcDirectory, targetDirectory)
  await Task.copy(Path.join(srcDirectory, 'index.html'), Path.join(targetDirectory, 'index.html'))
  return await createBundle(srcDirectory, targetDirectory)
}
interface WebsiteWatchState {
  srcDirectory: string
  targetDirectory: string
  rebuildTimer?: ReturnType<typeof setTimeout>
  rebuildRequested: boolean
  rebuildTask?: Promise<void>
}
// -------------------------------------------------------------------
// RunRebuildQueue
// -------------------------------------------------------------------
async function runRebuildQueue(state: WebsiteWatchState): Promise<void> {
  while (state.rebuildRequested) {
    state.rebuildRequested = false
    try {
      await buildDocs(state.srcDirectory, state.targetDirectory)
      await Task.copy(Path.join(state.srcDirectory, 'index.html'), Path.join(state.targetDirectory, 'index.html'))
    } catch (error) {
      console.error('Website rebuild error:', error)
    }
  }
  state.rebuildTask = undefined
}
// -------------------------------------------------------------------
// OnRebuildTimeout
// -------------------------------------------------------------------
function onRebuildTimeout(state: WebsiteWatchState): void {
  state.rebuildTimer = undefined
  state.rebuildRequested = true
  if (state.rebuildTask === undefined) state.rebuildTask = runRebuildQueue(state)
}
// -------------------------------------------------------------------
// OnSourceChange
// -------------------------------------------------------------------
function onSourceChange(
  state: WebsiteWatchState,
  _eventType: Fs.WatchEventType,
  _filename: string | Buffer | null
): void {
  if (state.rebuildTimer !== undefined) clearTimeout(state.rebuildTimer)
  state.rebuildTimer = setTimeout(onRebuildTimeout, 100, state)
}
// -------------------------------------------------------------------
// OnWatcherError
// -------------------------------------------------------------------
function onWatcherError(error: Error): void {
  console.error('Website source watcher error:', error)
}
// -------------------------------------------------------------------
// Serve
// -------------------------------------------------------------------
export async function serve(srcDirectory: string, targetDirectory: string, port: number): Promise<void> {
  const context = await prepareWebsite(srcDirectory, targetDirectory)
  const state: WebsiteWatchState = {
    srcDirectory,
    targetDirectory,
    rebuildRequested: false
  }
  const watcher = Fs.watch(srcDirectory, { recursive: true }, onSourceChange.bind(undefined, state))
  watcher.on('error', onWatcherError)
  try {
    await context.watch()
    const listener = await Task.serve(targetDirectory, port)
    try {
      await Task.openBrowser(listener.url)
      await listener.closed
    } finally {
      await listener.close()
    }
  } finally {
    if (state.rebuildTimer !== undefined) clearTimeout(state.rebuildTimer)
    watcher.close()
    if (state.rebuildTask !== undefined) await state.rebuildTask
    await context.dispose()
  }
}

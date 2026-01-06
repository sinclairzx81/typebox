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

import { marked } from 'marked'
import { Task } from 'tasksmith'

interface Manifest {
  [dir: string]: { [file: string]: string };
}
export async function BuildDocs(srcDirectory: string, targetDirectory: string): Promise<void> {
  const manifest: Manifest = {};
  async function processDir(srcDir: string, tgtDir: string) {
    const entries = [...Deno.readDirSync(srcDir)].sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
    for await (const entry of entries) {
      const srcPath = Task.path.join(srcDir, entry.name);
      const targetPath = Task.path.join(tgtDir, entry.name);
      if (entry.isDirectory) {
        await processDir(srcPath, Task.path.join(tgtDir, entry.name));
      } else if (entry.isFile && entry.name.endsWith('.md')) {
        const markdown = await Deno.readTextFile(srcPath)
        const html = await marked(markdown, { gfm: true })
        await Deno.mkdir(Task.path.dirname(targetPath), { recursive: true });
        const targetHtmlPath = targetPath.replace(/\.md$/, '.html');
        await Deno.writeTextFile(targetHtmlPath, html);
        // update manifest
        const dirName = Task.path.relative(srcDirectory, Task.path.dirname(srcPath))
        const fileName = Task.path.basename(entry.name).replace(/\.md$/, '')
        const htmlPath = Task.path.join(dirName, `${fileName}.html`).replaceAll('\\', '/')
        const sectionName = Task.path.basename(dirName)
        const documentName = Task.path.basename(htmlPath).replace(/\.html$/, '')
        manifest[sectionName] = manifest[sectionName] || {}
        manifest[sectionName][documentName] = htmlPath
      }
    }
  }
  await processDir(srcDirectory, targetDirectory);
  const manifestPath = Task.path.join(targetDirectory, 'manifest.json');
  await Deno.writeTextFile(manifestPath, JSON.stringify(manifest, null, 2));
}
export async function WatchDocs(srcDirectory: string, targetDirectory: string) {
  for await(const event of Deno.watchFs(srcDirectory, { recursive: true })) {
    await BuildDocs(srcDirectory, targetDirectory)
  }
}
export async function Website(target: string) {
  await Task.folder(target).delete()
  await Task.folder(target).add('design/website/index.html')
  await Task.folder(target).add('design/website/resources')
  await BuildDocs('design/website', target)
  const watch = WatchDocs('design/website', target)
  const serve = Task.serve(target)
  const bundle = Task.shell(`deno bundle --platform browser --watch --minify --output ${target}/index.js design/website/app/index.tsx`)
  const browser = Task.browser.open('http://localhost:5000')
  return Promise.all([watch, serve, bundle, browser])
}
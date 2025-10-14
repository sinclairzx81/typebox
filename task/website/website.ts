/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

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

interface ManifestEntry {
  section: string
  document: string
  htmlPath: string
}

const TOP_LEVEL_ORDER = [
  'overview',
  'type',
  'script',
  'value',
  'compile',
  'format',
  'system',
] as const

const SECTION_PRIORITY = new Map<string, number>(
  TOP_LEVEL_ORDER.map((slug, index) => [slug, index]),
)

function CompareSections(a: string, b: string): number {
  const priorityA = SECTION_PRIORITY.get(a)
  const priorityB = SECTION_PRIORITY.get(b)

  if (priorityA !== undefined || priorityB !== undefined) {
    const rankedA = priorityA ?? Number.MAX_SAFE_INTEGER
    const rankedB = priorityB ?? Number.MAX_SAFE_INTEGER
    if (rankedA !== rankedB) return rankedA - rankedB
  }

  return a.localeCompare(b)
}

function PagePriority(slug: string): number {
  if (slug === 'overview') return -1

  const match = slug.match(/^(\d+)_/)
  if (match) return parseInt(match[1], 10)

  return Number.MAX_SAFE_INTEGER
}

function ComparePageSlugs(a: string, b: string): number {
  const priorityA = PagePriority(a)
  const priorityB = PagePriority(b)

  if (priorityA !== priorityB) return priorityA - priorityB

  return a.localeCompare(b)
}

interface LlmsDocument {
  path: string
  content: string
}

interface LlmsDocumentMeta extends LlmsDocument {
  section: string | null
  slug: string | null
  index: number
}

function OrderLlmsDocuments(documents: LlmsDocument[]): LlmsDocument[] {
  const entries: LlmsDocumentMeta[] = documents.map((doc, index) => {
    const normalisedPath = doc.path.replaceAll('\\', '/')
    const parts = normalisedPath.split('/')

    if (parts.length >= 3 && parts[0] === 'docs') {
      const section = parts[1]
      const slug = parts[2].replace(/\.md$/, '')

      return { ...doc, path: normalisedPath, section, slug, index }
    }

    return { ...doc, path: normalisedPath, section: null, slug: null, index }
  })

  entries.sort((a, b) => {
    if (a.section && b.section) {
      const sectionComparison = CompareSections(a.section, b.section)
      if (sectionComparison !== 0) return sectionComparison

      if (a.slug && b.slug) {
        const pageComparison = ComparePageSlugs(a.slug, b.slug)
        if (pageComparison !== 0) return pageComparison
      }
    }
    
    if (a.section && !b.section) return -1
    if (!a.section && b.section) return 1

    return a.index - b.index
  })

  return entries.map(({ path, content }) => ({ path, content }))
}

async function WriteLlmsTxt(
  targetDirectory: string,
  documents: LlmsDocument[],
): Promise<void> {
  const orderedDocuments = OrderLlmsDocuments(documents)
  await Deno.mkdir(targetDirectory, { recursive: true })
  const llmsPath = Task.path.join(targetDirectory, 'llms.txt')
  const llmsContent = orderedDocuments
    .map(({ path, content }) => {
      const normalisedPath = path.replaceAll('\\', '/')
      const trimmed = content.trimEnd()
      return `# Source: ${normalisedPath}\n\n${trimmed}`
    })
    .join('\n\n---\n\n')
  await Deno.writeTextFile(
    llmsPath,
    llmsContent + (llmsContent.length ? '\n' : ''),
  )
}

export async function BuildDocs(
  srcDirectory: string,
  targetDirectory: string
): Promise<void> {
  const documents: LlmsDocument[] = [];
  const manifestEntries: ManifestEntry[] = []
  
  async function processDir(srcDir: string, tgtDir: string) {
    const entries = [...Deno.readDirSync(srcDir)].sort((a, b) => {
      return a.name.localeCompare(b.name)
    })

    for await (const entry of entries) {
      const srcPath = Task.path.join(srcDir, entry.name);
      
      if (entry.isDirectory) {
        await processDir(srcPath, Task.path.join(tgtDir, entry.name))
      } else if (entry.isFile && entry.name.endsWith('.md')) {
        const markdown = await Deno.readTextFile(srcPath)
        const html = await marked(markdown, { gfm: true })
        const relativePath = Task.path
          .relative(srcDirectory, srcPath)
          .replaceAll('\\', '/')
        if (relativePath.startsWith('docs/')) {
          documents.push({ path: relativePath, content: markdown })
        }
        const targetHtmlPath = Task.path
          .join(tgtDir, entry.name.replace(/\.md$/, '.html'))
        await Deno.mkdir(Task.path.dirname(targetHtmlPath), { recursive: true })
        await Deno.writeTextFile(targetHtmlPath, html)
        const dirName = Task.path.relative(
          srcDirectory,
          Task.path.dirname(srcPath),
        )
        const fileName = Task.path.basename(entry.name).replace(/\.md$/, '')
        manifestEntries.push({
          section: Task.path.basename(dirName),
          document: fileName,
          htmlPath: Task.path
            .join(dirName, `${fileName}.html`)
            .replaceAll('\\', '/'),
        })
      }
    }
  }
  await processDir(srcDirectory, targetDirectory);
  await WriteLlmsTxt(targetDirectory, documents)
  const manifest = manifestEntries.reduce<Manifest>((acc, entry) => {
    const sectionEntries = acc[entry.section] || {}
    acc[entry.section] = { ...sectionEntries, [entry.document]: entry.htmlPath }

    return acc
  }, {})
  const manifestPath = Task.path.join(targetDirectory, 'manifest.json');
  await Deno.writeTextFile(manifestPath, JSON.stringify(manifest, null, 2));
}
export async function WatchDocs(srcDirectory: string, targetDirectory: string) {
  for await (const event of Deno.watchFs(srcDirectory, { recursive: true })) {
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

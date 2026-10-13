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

import * as Process from 'node:child_process'
import * as Path from 'node:path'
import * as Task from '../task.ts'
import * as Manifest from './manifest.ts'

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
type BranchCoverage = {
  line: number
  block: number
  branch: number
  hits: number
}
type FunctionCoverage = {
  line: number
  hits: number
}
type FileCoverage = {
  path: string
  source: string[]
  ignoredLines: Set<number>
  lines: Map<number, number>
  branches: BranchCoverage[]
  functions: Map<string, FunctionCoverage>
}
type CoverageCount = {
  covered: number
  total: number
}
type CoverageTotals = {
  lines: CoverageCount
  branches: CoverageCount
  functions: CoverageCount
}
type CoverageDirectory = {
  directories: Map<string, CoverageDirectory>
  files: FileCoverage[]
  entries: { file: FileCoverage; path: string }[]
}
// -------------------------------------------------------------------
// CoverageFiles
// -------------------------------------------------------------------
function coverageFiles(lcov: string): FileCoverage[] {
  const files: FileCoverage[] = []
  let current: FileCoverage | undefined
  for (const entry of lcov.split(/\r?\n/)) {
    if (entry.startsWith('SF:')) {
      current = {
        path: entry.slice(3),
        source: [],
        ignoredLines: new Set(),
        lines: new Map(),
        branches: [],
        functions: new Map()
      }
      files.push(current)
    } else if (entry === 'end_of_record') {
      current = undefined
    } else if (current !== undefined && entry.startsWith('DA:')) {
      const [line, hits] = entry.slice(3).split(',')
      current.lines.set(Number(line), Number(hits))
    } else if (current !== undefined && entry.startsWith('BRDA:')) {
      const [line, block, branch, hits] = entry.slice(5).split(',')
      current.branches.push({
        line: Number(line),
        block: Number(block),
        branch: Number(branch),
        hits: hits === '-' ? 0 : Number(hits)
      })
    } else if (current !== undefined && entry.startsWith('FN:')) {
      const index = entry.indexOf(',')
      current.functions.set(entry.slice(index + 1), {
        line: Number(entry.slice(3, index)),
        hits: 0
      })
    } else if (current !== undefined && entry.startsWith('FNDA:')) {
      const index = entry.indexOf(',')
      const name = entry.slice(index + 1)
      const currentFunction = current.functions.get(name)
      if (currentFunction === undefined) {
        throw new Error(`Node reported counts for an unknown function: ${name}`)
      }
      currentFunction.hits = Number(entry.slice(5, index))
    }
  }
  if (files.length === 0) {
    throw new Error('Node did not produce any LCOV coverage records')
  }
  return files.sort((left, right) => left.path.localeCompare(right.path))
}
// -------------------------------------------------------------------
// IgnoredSourceLines
// -------------------------------------------------------------------
function ignoredSourceLines(source: string[], path: string): Set<number> {
  const ignored = new Set<number>()
  const startMarker = /\/\/[ \t]*deno-coverage-ignore-start\b/
  const stopMarker = /\/\/[ \t]*deno-coverage-ignore-stop\b/
  let ignoring = false
  for (const [index, line] of source.entries()) {
    const lineNumber = index + 1
    const start = startMarker.test(line)
    const stop = stopMarker.test(line)
    if (start && ignoring) {
      throw new Error(`Nested coverage-ignore start marker in ${path}:${lineNumber}`)
    }
    if (stop && !ignoring) {
      throw new Error(`Unmatched coverage-ignore stop marker in ${path}:${lineNumber}`)
    }
    if (ignoring) {
      const beforeStop = stop ? line.slice(0, line.search(stopMarker)) : line
      if (!stop || beforeStop.trim().length > 0) ignored.add(lineNumber)
    }
    if (start) ignoring = true
    if (stop) ignoring = false
  }
  if (ignoring) throw new Error(`Unclosed coverage-ignore start marker in ${path}`)
  return ignored
}
// -------------------------------------------------------------------
// LoadSources
// -------------------------------------------------------------------
async function loadSources(files: FileCoverage[]): Promise<void> {
  await Promise.all(files.map(async (file) => {
    relativeSourcePath(file.path)
    file.source = (await Task.read(Path.resolve(file.path))).split(/\r?\n/)
    if (file.source[file.source.length - 1] === '') file.source.pop()
    file.ignoredLines = ignoredSourceLines(file.source, file.path)
  }))
}
// -------------------------------------------------------------------
// CoverageTotals
// -------------------------------------------------------------------
function coverageTotals(files: FileCoverage[]): CoverageTotals {
  const totals: CoverageTotals = {
    lines: { covered: 0, total: 0 },
    branches: { covered: 0, total: 0 },
    functions: { covered: 0, total: 0 }
  }
  for (const file of files) {
    for (const [line, hits] of file.lines) {
      if (file.ignoredLines.has(line)) continue
      totals.lines.total++
      totals.lines.covered += Number(hits > 0)
    }
    for (const branch of file.branches) {
      if (file.ignoredLines.has(branch.line)) continue
      totals.branches.total++
      totals.branches.covered += Number(branch.hits > 0)
    }
    for (const fn of file.functions.values()) {
      if (file.ignoredLines.has(fn.line)) continue
      totals.functions.total++
      totals.functions.covered += Number(fn.hits > 0)
    }
  }
  return totals
}
// -------------------------------------------------------------------
// RelativeSourcePath
// -------------------------------------------------------------------
function relativeSourcePath(path: string): string {
  const relativePath = Path.relative(process.cwd(), Path.resolve(path))
  if (relativePath === '..' || relativePath.startsWith(`..${Path.sep}`)) {
    throw new Error(`Coverage file is outside the project: ${path}`)
  }
  return relativePath
}

// -------------------------------------------------------------------
// CoverageTree
// -------------------------------------------------------------------
function coverageTree(files: FileCoverage[]): CoverageDirectory {
  const root: CoverageDirectory = {
    directories: new Map(),
    files: [],
    entries: []
  }
  for (const file of files) {
    const path = relativeSourcePath(file.path)
    const segments = path.split(Path.sep)
    segments.pop()
    let directory = root
    root.files.push(file)
    for (const segment of segments) {
      const child: CoverageDirectory = directory.directories.get(segment) ?? { directories: new Map(), files: [], entries: [] }
      directory.directories.set(segment, child)
      child.files.push(file)
      directory = child
    }
    directory.entries.push({ file, path })
  }
  return root
}
// -------------------------------------------------------------------
// Percentage
// -------------------------------------------------------------------
export function coveragePercentage(covered: number, total: number): number {
  if (total === 0) return 100
  return Math.floor(covered * 1000 / total) / 10
}
// -------------------------------------------------------------------
// CoverageColor
// -------------------------------------------------------------------
function coverageColor(value: number): string {
  const bounded = Math.max(0, Math.min(100, value))
  const lower = bounded < 50
  const start = lower ? { red: 240, green: 68, blue: 79 } : { red: 240, green: 136, blue: 62 }
  const end = lower ? { red: 240, green: 136, blue: 62 } : { red: 52, green: 208, blue: 88 }
  const progress = lower ? bounded / 50 : (bounded - 50) / 50
  const red = Math.round(start.red + (end.red - start.red) * progress)
  const green = Math.round(start.green + (end.green - start.green) * progress)
  const blue = Math.round(start.blue + (end.blue - start.blue) * progress)
  return `rgb(${red}, ${green}, ${blue})`
}
// -------------------------------------------------------------------
// EscapeHtml
// -------------------------------------------------------------------
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
// -------------------------------------------------------------------
// CoverageBadge
// -------------------------------------------------------------------
function coverageBadge(value: number): string {
  const label = 'coverage'
  const result = `${value.toFixed(1)}%`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="122" height="20" role="img" aria-label="${label}: ${result}">
  <title>${label}: ${result}</title>
  <defs>
    <filter id="blur"><feGaussianBlur stdDeviation="16"/></filter>
    <linearGradient id="workflow-fill" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop stop-color="#444D56" offset="0%"/>
      <stop stop-color="#24292E" offset="100%"/>
    </linearGradient>
    <linearGradient id="state-fill" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop stop-color="#34D058" offset="0%"/>
      <stop stop-color="#28A745" offset="100%"/>
    </linearGradient>
    <clipPath id="r"><rect width="122" height="20" rx="3"/></clipPath>
  </defs>
  <g clip-path="url(#r)">
    <rect width="68" height="20" fill="url(#workflow-fill)"/>
    <rect x="68" width="54" height="20" fill="url(#state-fill)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <g transform="scale(.1)">
      <g aria-hidden="true" fill="#010101">
        <text x="340" y="150" fill-opacity=".8" filter="url(#blur)" textLength="560">${label}</text>
        <text x="340" y="150" fill-opacity=".3" textLength="560">${label}</text>
      </g>
      <text x="340" y="140" textLength="560">${label}</text>
    </g>
    <g transform="scale(.1)">
      <g aria-hidden="true" fill="#010101">
        <text x="950" y="150" fill-opacity=".8" filter="url(#blur)" textLength="440">${result}</text>
        <text x="950" y="150" fill-opacity=".3" textLength="440">${result}</text>
      </g>
      <text x="950" y="140" textLength="440">${result}</text>
    </g>
  </g>
</svg>
`
}
// -------------------------------------------------------------------
// CoverageValue
// -------------------------------------------------------------------
function coverageValue(value: number): string {
  const formatted = value.toFixed(1)
  const point = formatted.indexOf('.')
  return `<span class="coverage-value"><span>${formatted.slice(0, point)}</span><span>${formatted.slice(point)}%</span></span>`
}
// -------------------------------------------------------------------
// CoverageMetrics
// -------------------------------------------------------------------
function coverageMetrics(totals: CoverageTotals): string {
  return [
    { name: 'Lines', value: totals.lines },
    { name: 'Branches', value: totals.branches },
    { name: 'Functions', value: totals.functions }
  ].map(({ name, value }) => {
    const coverage = coveragePercentage(value.covered, value.total)
    const color = name === 'Lines' ? ` style="color:${coverageColor(coverage)}"` : ''
    return `<div class="metric"><span class="metric-value"${color}>${coverage.toFixed(1)}%</span><span>${name} (${value.covered}/${value.total})</span></div>`
  }).join('')
}
// -------------------------------------------------------------------
// CoverageCells
// -------------------------------------------------------------------
function coverageCells(totals: CoverageTotals): string {
  const values = [
    { name: 'Lines', value: totals.lines },
    { name: 'Branches', value: totals.branches },
    { name: 'Functions', value: totals.functions }
  ]
  return values.map(({ name, value }) => {
    const coverage = coveragePercentage(value.covered, value.total)
    const color = name === 'Lines' ? ` style="color:${coverageColor(coverage)}"` : ''
    return `<td${color}>${coverageValue(coverage)}<span class="ratio">${value.covered}/${value.total}</span></td>`
  }).join('')
}
// -------------------------------------------------------------------
// IsCoverageIncomplete
// -------------------------------------------------------------------
function isCoverageIncomplete(totals: CoverageTotals): boolean {
  return totals.lines.covered < totals.lines.total
    || totals.branches.covered < totals.branches.total
}
// -------------------------------------------------------------------
// RelativeHref
// -------------------------------------------------------------------
function relativeHref(fromFile: string, toFile: string): string {
  return Path.relative(Path.dirname(fromFile), toFile)
    .split(Path.sep)
    .map(encodeURIComponent)
    .join('/')
}
// -------------------------------------------------------------------
// DirectoryPagePath
// -------------------------------------------------------------------
function directoryPagePath(outputDirectory: string, directoryPath: string): string {
  return Path.join(outputDirectory, directoryPath, 'index.html')
}
// -------------------------------------------------------------------
// FilePagePath
// -------------------------------------------------------------------
function filePagePath(outputDirectory: string, sourcePath: string): string {
  return Path.join(outputDirectory, `${sourcePath}.html`)
}
// -------------------------------------------------------------------
// Breadcrumbs
// -------------------------------------------------------------------
function breadcrumbs(
  outputDirectory: string,
  pagePath: string,
  directoryPath: string,
  fileName?: string,
): string {
  if (directoryPath === '' && fileName === undefined) {
    return '<nav class="breadcrumbs" aria-label="Breadcrumb"><span aria-current="page">Coverage</span></nav>'
  }
  const parts = [
    `<a href="${relativeHref(pagePath, directoryPagePath(outputDirectory, ''))}">Coverage</a>`
  ]
  const segments = directoryPath === '' ? [] : directoryPath.split(Path.sep)
  const linkedSegments = fileName === undefined ? segments.slice(0, -1) : segments
  let currentDirectory = ''
  for (const segment of linkedSegments) {
    currentDirectory = currentDirectory === '' ? segment : Path.join(currentDirectory, segment)
    parts.push(`<a href="${relativeHref(pagePath, directoryPagePath(outputDirectory, currentDirectory))}">${escapeHtml(segment)}</a>`)
  }
  const currentLabel = fileName
    ?? (segments.length === 0 ? 'Coverage' : `${segments[segments.length - 1]}/`)
  parts.push(`<span aria-current="page">${escapeHtml(currentLabel)}</span>`)
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${parts.join('<span aria-hidden="true">/</span>')}</nav>`
}
// -------------------------------------------------------------------
// HtmlDocument
// -------------------------------------------------------------------
function htmlDocument(outputDirectory: string, pagePath: string, title: string, body: string): string {
  const stylesheet = relativeHref(pagePath, Path.join(outputDirectory, 'coverage.css'))
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="${escapeHtml(stylesheet)}">
</head>
<body>
${body}
</body>
</html>
`
}
// -------------------------------------------------------------------
// CoverageStyles
// -------------------------------------------------------------------
const coverageStyles = `:root {
  color-scheme: dark;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #070a0e;
  color: #f5f7fb;
}
* { box-sizing: border-box; }
body { max-width: 80rem; margin: 0 auto; padding: 2rem 1.25rem 3rem; }
a { color: #e0c285; text-decoration: none; }
a:hover { color: #fff; text-decoration: underline; }
a:focus-visible { outline: 2px solid #e0c285; outline-offset: 3px; }
header { margin-bottom: 1.5rem; }
h1 { margin: .5rem 0 1rem; font-size: 1.5rem; font-weight: 500; }
.breadcrumbs { display: flex; flex-wrap: wrap; gap: .5rem; color: #8f9bb0; font-size: .875rem; }
.breadcrumbs [aria-current="page"] { color: #dfe2e6; }
.metrics { display: flex; flex-wrap: wrap; gap: .75rem; margin: 1rem 0 1.5rem; }
.metric { display: grid; gap: .25rem; min-width: 9rem; padding: .75rem 1rem; border: 1px solid #252c38; border-radius: .35rem; background: #0f141c; }
.metric > span:last-child { color: #8f9bb0; font-size: .8rem; }
.metric-value { color: #f5f7fb; font-size: 1.5rem; font-variant-numeric: tabular-nums; }
.listing { overflow-x: auto; border: 1px solid #313741; border-radius: .35rem; background: #0f141c; }
table { width: 100%; border-collapse: collapse; text-align: right; }
th, td { padding: .7rem 1rem; border-bottom: 1px solid #252c38; white-space: nowrap; }
thead { background: #171c25; color: #e0c285; font-size: .7rem; letter-spacing: .08em; text-transform: uppercase; }
thead th:first-child, tbody th { text-align: left; }
tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
tbody tr:hover { background: #121822; }
tbody tr.coverage-incomplete { background: #29191b; }
tbody tr.coverage-incomplete:hover { background: #351f22; }
tbody th { font-weight: 400; }
.kind { display: inline-block; min-width: 3.25rem; margin-right: .75rem; color: #8f9bb0; font-size: .7rem; letter-spacing: .06em; }
.ratio { display: block; margin-top: .15rem; color: #8f9bb0; font-size: .7rem; font-variant-numeric: tabular-nums; }
.empty { padding: 1rem; color: #8f9bb0; }
.file-summary { margin-bottom: 1rem; }
.source { overflow: auto; border: 1px solid #313741; border-radius: .35rem; background: #0f141c; }
pre { margin: 0; padding: .75rem 0; color: #dfe2e6; font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; }
.line { display: flex; min-height: 1.55em; padding-right: 1rem; white-space: pre; }
.line.covered { background: #10251a; }
.line.missed { border-left: 3px solid #f0444f; background: #341619; color: #ffd9dc; }
.line.ignored { background: #141619; color: #858b94; }
.line.neutral { color: #9da3ab; }
.number { flex: 0 0 4.5rem; margin-right: 1rem; color: #666d76; text-align: right; user-select: none; }
.line.missed .number { color: #e88990; }
.line code { font: inherit; }
.branch-missed { margin-left: 1rem; padding: 0 .3rem; border-radius: .2rem; background: #4a1e24; color: #ffd9dc; font-size: .75rem; }
@media (max-width: 40rem) {
  body { padding: 1.25rem .75rem 2rem; }
  th, td { padding: .6rem .65rem; }
  .kind { min-width: 0; margin-right: .4rem; }
}
`
// -------------------------------------------------------------------
// RenderSourceLines
// -------------------------------------------------------------------
function renderSourceLines(file: FileCoverage): string {
  const source = file.source
  const branchesByLine = new Map<number, BranchCoverage[]>()
  for (const branch of file.branches) {
    if (file.ignoredLines.has(branch.line)) continue
    const current = branchesByLine.get(branch.line) ?? []
    current.push(branch)
    branchesByLine.set(branch.line, current)
  }
  const lines = source.map((text, offset) => {
    const lineNumber = offset + 1
    const hits = file.lines.get(lineNumber)
    const branches = branchesByLine.get(lineNumber)
    const uncoveredBranches = branches?.filter((branch) => branch.hits === 0) ?? []
    const coveredBranches = branches === undefined ? undefined : branches.length - uncoveredBranches.length
    const ignored = file.ignoredLines.has(lineNumber)
    const status = ignored ? 'ignored' : hits === undefined ? 'neutral' : hits > 0 ? 'covered' : 'missed'
    const branchLabel = branches === undefined ? '' : `; branches ${coveredBranches}/${branches.length}`
    const uncoveredLabel = uncoveredBranches.length === 0 ? '' : `; not taken: ${uncoveredBranches.map(({ block, branch }) => `${block}.${branch}`).join(', ')}`
    const lineLabel = ignored ? 'ignored by c8 directive' : `${hits ?? 'not counted'} hits${branchLabel}${uncoveredLabel}`
    const branchMarkers = uncoveredBranches.map(({ block, branch }) =>
      `<span class="branch-missed" title="LCOV block ${block}, branch ${branch} was not taken">branch ${block}.${branch} not taken</span>`
    ).join('')
    return `<span class="line ${status}" id="line-${lineNumber}" title="Line ${lineNumber}: ${lineLabel}"><span class="number">${lineNumber}</span><code>${escapeHtml(text) || ' '}</code>${branchMarkers}</span>`
  }).join('')
  return lines
}
// -------------------------------------------------------------------
// RenderDirectoryEntry
// -------------------------------------------------------------------
function renderDirectoryEntry(
  pagePath: string,
  name: string,
  targetPath: string,
  kind: 'DIR' | 'FILE',
  totals: CoverageTotals,
): string {
  const href = relativeHref(pagePath, targetPath)
  const status = isCoverageIncomplete(totals) ? ' class="coverage-incomplete"' : ''
  return `<tr${status}><th scope="row"><span class="kind">${kind}</span><a href="${escapeHtml(href)}">${escapeHtml(name)}</a></th>${coverageCells(totals)}</tr>`
}
// -------------------------------------------------------------------
// RenderDirectoryPage
// -------------------------------------------------------------------
async function writeDirectoryPages(
  directory: CoverageDirectory,
  outputDirectory: string,
  directoryPath: string,
): Promise<void> {
  const pagePath = directoryPagePath(outputDirectory, directoryPath)
  const title = directoryPath === '' ? 'TypeBox Coverage' : `${directoryPath.replaceAll(Path.sep, '/')} · TypeBox Coverage`
  const folders = [...directory.directories.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, child]) => {
      const childPath = directoryPath === '' ? name : Path.join(directoryPath, name)
      return renderDirectoryEntry(
        pagePath,
        `${name}/`,
        directoryPagePath(outputDirectory, childPath),
        'DIR',
        coverageTotals(child.files),
      )
    })
  const files = [...directory.entries]
    .sort((left, right) => left.path.localeCompare(right.path))
    .map(({ file, path }) => renderDirectoryEntry(
      pagePath,
      Path.basename(path),
      filePagePath(outputDirectory, path),
      'FILE',
      coverageTotals([file]),
    ))
  const entries = [...folders, ...files].join('\n')
  const heading = directoryPath === '' ? 'Coverage overview' : `${Path.basename(directoryPath)}/`
  const body = `<header>${breadcrumbs(outputDirectory, pagePath, directoryPath)}<h1>${escapeHtml(heading)}</h1></header>
<section class="metrics" aria-label="Coverage summary">${coverageMetrics(coverageTotals(directory.files))}</section>
<section class="listing" aria-label="Coverage directory">
<table><thead><tr><th scope="col">Path</th><th scope="col">Lines</th><th scope="col">Branches</th><th scope="col">Functions</th></tr></thead>
<tbody>${entries || '<tr><td class="empty" colspan="4">No covered modules in this directory.</td></tr>'}</tbody></table>
</section>`
  await Task.write(pagePath, htmlDocument(outputDirectory, pagePath, title, body))
  const directoryEntries = [...directory.directories.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
  const fileEntries = [...directory.entries].sort((left, right) => left.path.localeCompare(right.path))
  for (const [name, child] of directoryEntries) {
    const childPath = directoryPath === '' ? name : Path.join(directoryPath, name)
    await writeDirectoryPages(child, outputDirectory, childPath)
  }
  for (const { file, path } of fileEntries) {
    const filePath = filePagePath(outputDirectory, path)
    const fileName = Path.basename(path)
    const sourcePath = path
    const parentDirectory = Path.dirname(path) === '.' ? '' : Path.dirname(path)
    const fileTotals = coverageTotals([file])
    const fileBody = `<header>${breadcrumbs(outputDirectory, filePath, parentDirectory, fileName)}<h1>${escapeHtml(fileName)}</h1></header>
<section class="metrics file-summary" aria-label="Module coverage">${coverageMetrics(fileTotals)}</section>
<section class="source" aria-label="Source coverage"><pre>${renderSourceLines(file)}</pre></section>`
    await Task.write(filePath, htmlDocument(outputDirectory, filePath, `${sourcePath} · TypeBox Coverage`, fileBody))
  }
}
// -------------------------------------------------------------------
// WriteHtmlReport
// -------------------------------------------------------------------
async function writeHtmlReport(
  files: FileCoverage[],
  outputDirectory: string,
): Promise<void> {
  await Task.write(Path.join(outputDirectory, 'coverage.css'), coverageStyles)
  await writeDirectoryPages(coverageTree(files), outputDirectory, '')
}
// -------------------------------------------------------------------
// RunTests
// -------------------------------------------------------------------
async function runTests(roots: string[], lcovPath: string): Promise<number> {
  const manifest = await Manifest.write(roots)
  const args = [
    '--test',
    '--experimental-test-coverage',
    '--test-coverage-exclude=**/node_modules/**',
    '--test-reporter=spec',
    '--test-reporter-destination=stdout',
    '--test-reporter=lcov',
    `--test-reporter-destination=${lcovPath}`,
    manifest
  ]
  return new Promise<number>((resolve, reject) => {
    const child = Process.spawn('node', args, {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
    child.once('error', reject)
    child.once('close', (code, signal) => {
      if (signal !== null) {
        reject(new Error(`Coverage test process received signal ${signal}`))
      } else if (code === null) {
        reject(new Error('Coverage test process exited without a status code'))
      } else resolve(code)
    })
  })
}
// -------------------------------------------------------------------
// Report
// -------------------------------------------------------------------
export async function report(roots: string[], options: { open?: boolean } = {}): Promise<void> {
  const outputDirectory = Path.resolve('target/coverage')
  const lcovPath = Path.join(outputDirectory, 'coverage.lcov')
  const htmlPath = Path.join(outputDirectory, 'index.html')
  const badgePath = Path.join(outputDirectory, 'badge.svg')
  await Task.remove(Path.resolve('target/report'))
  await Task.remove(outputDirectory)
  await Task.createDir(outputDirectory)
  const testExitCode = await runTests(roots, lcovPath)
  const files = coverageFiles(await Task.read(lcovPath))
  await loadSources(files)
  const totals = coverageTotals(files)
  await writeHtmlReport(files, outputDirectory)
  await Task.write(badgePath, coverageBadge(coveragePercentage(totals.lines.covered, totals.lines.total)))
  await Task.remove(Path.resolve('design/coverage'))
  console.log(`HTML coverage site: ${Path.relative(process.cwd(), htmlPath)}`)
  console.log(`Coverage badge: ${Path.relative(process.cwd(), badgePath)}`)
  if (options.open !== false) {
    await Task.openBrowser(htmlPath)
  }
  if (testExitCode !== 0) {
    throw new Error(`Coverage test process exited with code ${testExitCode}`)
  }
}

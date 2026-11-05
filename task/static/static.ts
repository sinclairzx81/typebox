// deno-fmt-ignore-file

import { API } from 'typescript/unstable/sync'
import * as Proc from 'node:child_process'
import * as Path from 'node:path'
import * as Fsp from 'node:fs/promises'
import * as Fs from 'node:fs'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
type Metric = number | undefined
type Result = {
  name: string
  load: number
  infer: number
  check: string
  instantiations: Metric
  baselineInstantiations: Metric
  instantiationsDelta: Metric
  types: Metric
  memory: string
  trace: string
  completion: CompletionResult[]
}
type CompletionResult = {
  index: number
  line: number
  snippet: string[]
  load: number
  infer: number
  warm: number
  entries: string[]
  error?: string
}
type CompletionAttempt = {
  duration: number
  entries?: string[]
  error?: string
}
type TraceEvent = {
  cat?: string
  name?: string
  ph?: string
  dur?: number
  args?: { path?: string }
}
type ModuleCost = {
  name: string
  duration: number
}

// ------------------------------------------------------------------
// Environment
// ------------------------------------------------------------------
const Root = process.cwd()
const Directory = Path.join(Root, 'task', 'static')
const Target = Path.join(Root, 'target', 'infer')
const Source = Path.join(Root, 'src')
const Built = Path.join(Root, 'target', 'build', 'build')
const Compiler = Path.join(Root, 'node_modules', 'typescript', 'bin', 'tsc')
type PackageMode = 'source' | 'build'

// ------------------------------------------------------------------
// Reporting
// ------------------------------------------------------------------
function MetricNumber(output: string, name: string): Metric {
  const match = output.match(new RegExp(`^${name}:\\s+(\\d+)`, 'm'))
  return match === null ? undefined : Number(match[1])
}
function MetricText(output: string, name: string): string {
  const match = output.match(new RegExp(`^${name}:\\s+(.+)$`, 'm'))
  return match === null ? '-' : match[1]
}
function FormatMetric(value: Metric): string {
  return value === undefined ? '-' : value.toLocaleString()
}
function FormatMemory(value: string): string {
  const match = value.match(/^(\d+)K$/)
  return match === null ? value : `${(Number(match[1]) / 1024).toFixed(1)}MB`
}
function Difference(value: Metric, baseline: Metric): Metric {
  return value === undefined || baseline === undefined ? value : Math.max(0, value - baseline)
}
function FormatDuration(value: number): string {
  return `${(value / 1000).toFixed(1)}ms`
}
function FormatMilliseconds(value: number): string {
  return `${(value * 1000).toFixed(1)}ms`
}
function FormatRequestMilliseconds(value: number): string {
  return `${value.toFixed(1)}ms`
}
function ParseSeconds(value: string): number {
  const match = value.match(/^([\d.]+)s$/)
  return match === null ? 0 : Number(match[1])
}
function CompletionSnippet(contents: string, marker: number): { line: number, snippet: string[] } {
  const lines = contents.split(/\r?\n/)
  const line = contents.slice(0, marker).split(/\r?\n/).length
  const start = Math.max(1, line - 1)
  const end = Math.min(lines.length, line + 1)
  return {
    line,
    snippet: lines.slice(start - 1, end).map((text, index) => `${String(start + index).padStart(3, ' ')} │ ${HighlightCode(text)}`)
  }
}
function CompletionRequest(contents: string, marker: number): { position: number, triggerCharacter?: string } {
  const end = marker + '/*request*/'.length
  const access = contents.slice(end).match(/^\s*(\?\.|\.|\[)/)
  if (access === null) return { position: marker }
  return {
    position: end + access[0].length,
    triggerCharacter: access[1] === '[' ? undefined : '.'
  }
}
function ProbeCompletion(request: () => { entries: readonly { name: string }[] } | undefined): CompletionAttempt {
  const start = performance.now()
  try {
    const result = request()
    return {
      duration: performance.now() - start,
      entries: result?.entries.map((entry) => entry.name) ?? []
    }
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'completion list needs auto imports') throw error
    return {
      duration: performance.now() - start,
      error: error.message
    }
  }
}
function Completion(source: string, config: string): CompletionResult[] {
  const contents = Fs.readFileSync(source, 'utf8')
  const markers = [...contents.matchAll(/\/\*request\*\//g)]
  return markers.map((match, index) => {
    const marker = match.index
    if (marker === undefined) throw new Error('Unable to locate request marker')
    const position = CompletionSnippet(contents, marker)
    const request = CompletionRequest(contents, marker)
    const api = new API({ cwd: Root })
    try {
      const startLoad = performance.now()
      const snapshot = api.updateSnapshot({ openProjects: [config] })
      const project = snapshot.getProject(config)
      if (project === undefined) throw new Error(`Unable to open inference project: ${config}`)
      const loadDuration = performance.now() - startLoad
      const options = request.triggerCharacter === undefined ? undefined : { triggerCharacter: request.triggerCharacter }
      const query = () => project.checker.getCompletionsAtPosition(source, request.position, options)
      const cold = ProbeCompletion(query)
      const warm = ProbeCompletion(query)
      return {
        index: index + 1,
        line: position.line,
        snippet: position.snippet,
        load: loadDuration,
        infer: cold.duration,
        warm: warm.duration,
        entries: warm.entries ?? cold.entries ?? [],
        error: warm.error ?? (warm.entries === undefined ? cold.error : undefined)
      }
    } finally {
      api.close()
    }
  })
}
function Colour(value: string, red: number, green: number, blue: number): string {
  return `\u001b[38;2;${red};${green};${blue}m${value}\u001b[0m`
}
function HighlightCode(line: string): string {
  const token = /"[^"]*"|'[^']*'|`[^`]*`|\/\/.*|\/\*.*\*\/|\b(import|from|const|type|function|return|extends|infer|as|typeof)\b|\bType\.[A-Za-z]+\b|\b[A-Z][A-Za-z0-9_]*\b|\b\d+\b/g
  return line.replace(token, (value) => {
    if (value.startsWith('//') || value.startsWith('/*')) return Colour(value, 120, 150, 120)
    if (value.startsWith('"') || value.startsWith("'") || value.startsWith('`')) return Colour(value, 255, 190, 110)
    if (value.startsWith('Type.')) return Colour(value, 80, 210, 255)
    if (/^\d+$/.test(value)) return Colour(value, 220, 160, 255)
    if (/^[A-Z]/.test(value)) return Colour(value, 255, 230, 130)
    return Colour(value, 255, 140, 180)
  })
}
function PrintFixture(fixture: string): void {
  const lines = Fs.readFileSync(fixture, 'utf8').trimEnd().split('\n')
  console.log('')
  PrintBox('Source Code')
  for (const [index, line] of lines.entries()) {
    const number = Colour(`${String(index + 1).padStart(3, ' ')} │ `, 120, 120, 120)
    console.log(`${number}${HighlightCode(line)}`)
  }
}
function TraceModules(trace: string, mode: PackageMode): ModuleCost[] {
  const events = JSON.parse(Fs.readFileSync(trace, 'utf8')) as TraceEvent[]
  const durations = new Map<string, number>()
  const fixture = `${Path.basename(Path.dirname(Path.dirname(trace)))}.ts`
  for (const event of events) {
    if (event.cat !== 'check' || event.name !== 'checkExpression' || event.ph !== 'X' || event.dur === undefined || event.args?.path === undefined) continue
    const path = event.args.path
    let name: string
    if (mode === 'source') {
      const relative = Path.relative(Source, Path.resolve(path))
      if (relative === '' || relative === '..' || relative.startsWith(`..${Path.sep}`) || Path.isAbsolute(relative)) continue
      name = relative.split(Path.sep).join('/')
    } else {
      if (Path.basename(path) !== 'fixture.ts') continue
      name = fixture
    }
    durations.set(name, (durations.get(name) ?? 0) + event.dur)
  }
  return [...durations.entries()]
    .map(([name, duration]) => ({ name, duration }))
    .sort((left, right) => right.duration - left.duration)
    .slice(0, 10)
}
function PrintFlameGraph(trace: string, mode: PackageMode): void {
  const modules = TraceModules(trace, mode)
  const total = modules.reduce((result, module) => result + module.duration, 0)
  console.log('')
  PrintBox('Infrastructure Metrics')
  if (modules.length === 0) {
    console.log(Colour('No file-attributed checker events found.', 255, 100, 100))
    return
  }
  const width = 48
  const headings = ['#', 'Module', 'Check time', 'Top 10 share', 'Bar']
  const rows = modules.map((module, index) => {
    const ratio = total === 0 ? 0 : module.duration / total
    return [
      String(index + 1),
      module.name,
      FormatDuration(module.duration),
      `${Math.round(ratio * 100)}%`,
      '█'.repeat(Math.max(1, Math.round(ratio * width)))
    ]
  })
  const widths = headings.map((heading, index) => Math.max(heading.length, ...rows.map((row) => row[index].length)))
  const border = (left: string, middle: string, right: string) => `${left}${widths.map((column) => '─'.repeat(column + 2)).join(middle)}${right}`
  const line = (values: string[], colorColumn?: number) => `│ ${values.map((value, index) => {
    const padded = value.padEnd(widths[index])
    return index === colorColumn ? Colour(padded, 255, 140, 0) : padded
  }).join(' │ ')} │`
  console.log(border('┌', '┬', '┐'))
  console.log(Colour(line(headings), 255, 220, 100))
  console.log(border('├', '┼', '┤'))
  for (const row of rows) console.log(line(row, 4))
  console.log(border('└', '┴', '┘'))
}
function PrintBox(title: string): void {
  const width = Math.max(67, title.length)
  const border = `┌${'─'.repeat(width + 2)}┐`
  console.log(Colour(border, 255, 180, 70))
  console.log(Colour(`│ ${title.padEnd(width)} │`, 255, 180, 70))
  console.log(Colour(`└${'─'.repeat(width + 2)}┘`, 255, 180, 70))
}
function CleanTrace(traceDirectory: string): void {
  for (const entry of Fs.readdirSync(traceDirectory)) {
    if (entry.startsWith('types_') && entry.endsWith('.json')) {
      Fs.rmSync(Path.join(traceDirectory, entry), { force: true })
    }
  }
}
function Compile(fixture: string, name: string, mode: PackageMode, trace: boolean): Result {
  const outputDirectory = Path.join(Target, name)
  const config = Path.join(outputDirectory, 'tsconfig.json')
  const source = Path.join(outputDirectory, 'fixture.ts')
  const traceDirectory = Path.join(outputDirectory, 'trace')
  Fs.rmSync(outputDirectory, { recursive: true, force: true })
  Fs.mkdirSync(outputDirectory, { recursive: true })
  Fs.copyFileSync(fixture, source)
  const compilerOptions: Record<string, unknown> = {
    noEmit: true,
    extendedDiagnostics: true
  }
  const packageDirectory = mode === 'build' ? Built : Source
  const extension = mode === 'build' ? 'd.mts' : 'ts'
  const packageType = (entrypoint: string = '') => Path.relative(outputDirectory, Path.join(packageDirectory, entrypoint, `index.${extension}`))
  const paths: Record<string, string[]> = {
    typebox: [packageType()],
    'typebox/*': [Path.relative(outputDirectory, Path.join(packageDirectory, '*', `index.${extension}`))]
  }
  for (const entrypoint of ['compile', 'error', 'format', 'guard', 'schema', 'system', 'type', 'value']) {
    paths[`typebox/${entrypoint}`] = [packageType(entrypoint)]
  }
  compilerOptions.paths = paths
  if (trace) compilerOptions.generateTrace = traceDirectory
  Fs.writeFileSync(config, JSON.stringify({
    extends: Path.relative(outputDirectory, Path.join(Root, 'tsconfig.json')),
    include: [],
    files: ['fixture.ts'],
    compilerOptions
  }, null, 2))
  const proc = Proc.spawnSync(process.execPath, [Compiler, '--project', config, '--pretty', 'false'], {
    cwd: Root,
    encoding: 'utf8'
  })
  const output = `${proc.stdout ?? ''}${proc.stderr ?? ''}`
  if (proc.error !== undefined) throw proc.error
  if (proc.status !== 0) {
    proc.stdout && proc.stdout.trim().length > 0 && console.error(proc.stdout)
    proc.stderr && proc.stderr.trim().length > 0 && console.error(proc.stderr)
    throw new Error(`Inference fixture failed: ${name}`)
  }
  return {
    name,
    load: 0,
    infer: 0,
    check: MetricText(output, 'Check time'),
    instantiations: MetricNumber(output, 'Instantiations'),
    baselineInstantiations: undefined,
    instantiationsDelta: undefined,
    types: MetricNumber(output, 'Types'),
    memory: MetricText(output, 'Memory used'),
    trace: Path.join(traceDirectory, 'trace.json'),
    completion: Completion(source, config)
  }
}
function Print(result: Result, mode: PackageMode): void {
  const table = (headings: string[], row: string[]) => {
    const widths = headings.map((heading, index) => Math.max(heading.length, row[index].length))
    const border = (left: string, middle: string, right: string) => `${left}${widths.map((width) => '─'.repeat(width + 2)).join(middle)}${right}`
    const line = (values: string[]) => `│ ${values.map((value, index) => value.padEnd(widths[index])).join(' │ ')} │`
    console.log(border('┌', '┬', '┐'))
    console.log(Colour(line(headings), 255, 220, 100))
    console.log(border('├', '┼', '┤'))
    console.log(line(row))
    console.log(border('└', '┴', '┘'))
  }
  PrintFlameGraph(result.trace, mode)
  console.log('')
  PrintBox('Module Metrics')
  table(['Module Instantiations', 'Import Instantiations', 'Total Instantiations', 'Types', 'Check', 'Memory'], [
    FormatMetric(result.instantiationsDelta),
    FormatMetric(result.baselineInstantiations),
    FormatMetric(result.instantiations),
    FormatMetric(result.types),
    FormatMilliseconds(ParseSeconds(result.check)),
    FormatMemory(result.memory)
  ])
  for (const completion of result.completion) {
    console.log('')
    PrintBox(`Completion Request (line ${completion.line})`)
    for (const line of completion.snippet) console.log(line)
    console.log('')
    const output = completion.error === undefined
      ? completion.entries.slice(0, 12).join(', ') || '(none)'
      : `unavailable (${completion.error})`
    console.log(`Output: ${output}`)
    console.log('')
    table(['Cold request', 'Cold total', 'Warm request', 'Entries'], [
      FormatRequestMilliseconds(completion.infer),
      FormatRequestMilliseconds(completion.load + completion.infer),
      FormatRequestMilliseconds(completion.warm),
      completion.error === undefined ? completion.entries.length.toLocaleString() : 'n/a'
    ])
  }
}
// ------------------------------------------------------------------
// Run
// ------------------------------------------------------------------
async function Run(mode: PackageMode): Promise<void> {
  Fs.rmSync(Target, { recursive: true, force: true })
  await Fsp.mkdir(Target, { recursive: true })
  const fixture = Path.join(Directory, 'debug.ts')
  if (!Fs.existsSync(fixture)) throw new Error(`Static fixture not found: '${fixture}'`)
  if (mode === 'build' && !Fs.existsSync(Path.join(Built, 'index.d.mts'))) {
    throw new Error(`Built TypeBox declarations not found in '${Built}'. Run 'npm run build' before 'npm run static-build'.`)
  }
  const name = Path.basename(fixture, '.ts')
  const background = Path.join(Target, `${name}-background.ts`)
  Fs.writeFileSync(background, "import Type from 'typebox'\nvoid Type\n")
  const backgroundResult = Compile(background, `${name}-background`, mode, false)
  const result = Compile(fixture, name, mode, true)
  result.load = ParseSeconds(backgroundResult.check)
  result.infer = Math.max(0, ParseSeconds(result.check) - result.load)
  result.baselineInstantiations = backgroundResult.instantiations
  result.instantiationsDelta = Difference(result.instantiations, backgroundResult.instantiations)
  result.types = Difference(result.types, backgroundResult.types)
  PrintFixture(fixture)
  Print(result, mode)
  CleanTrace(Path.dirname(result.trace))
}
export async function Static(): Promise<void> {
  await Run('source')
}
export async function StaticBuild(): Promise<void> {
  await Run('build')
}

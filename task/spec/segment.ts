/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

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

import * as Fs from 'node:fs'
import * as Path from 'node:path'
import * as Clone from './clone.ts'
import * as Report from './report.ts'
import * as Model from './model.ts'

const SUITE_TEST_DIRECTORY = 'validation/tests'

// ------------------------------------------------------------------
// Segment Types
// ------------------------------------------------------------------
type ValidationCallback = (draft: string, externalSchemas: Model.SchemaContext, schema: Model.Schema, value: unknown) => boolean | null
interface SegmentOptions {
  segmentedDirectory: string
  cloneDirectory: string
  dialects?: readonly Model.Dialect[]
  layout?: 'split' | 'underscore'
  report?: Report.ReportOptions
}
interface SegmentedDocuments {
  passing: Map<string, Model.TestGroup[]>
  failing: Map<string, Model.TestGroup[]>
}
// ------------------------------------------------------------------
// IsRecord
// ------------------------------------------------------------------
function IsRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
// ------------------------------------------------------------------
// ParseGroups
// ------------------------------------------------------------------
function ParseGroups(value: unknown, path: string): Model.TestGroup[] {
  const groups = Array.isArray(value) ? value : IsRecord(value) && Array.isArray(value.tests) ? value.tests : undefined
  if (!groups) throw new Error(`Invalid JSON Schema test file: ${path}`)
  return groups.map((group, index) => {
    if (!IsRecord(group) || !Array.isArray(group.tests)) throw new Error(`Invalid test group at ${path}#${index}`)
    if (typeof group.schema !== 'boolean' && !IsRecord(group.schema)) throw new Error(`Invalid schema at ${path}#${index}`)
    const tests = group.tests.map((test, testIndex) => {
      if (!IsRecord(test) || typeof test.valid !== 'boolean' || !('data' in test)) {
        throw new Error(`Invalid test case at ${path}#${index}:${testIndex}`)
      }
      return test as Model.TestCase
    })
    return { ...group, tests } as Model.TestGroup
  })
}
// ------------------------------------------------------------------
// LoadSuiteFiles
// ------------------------------------------------------------------
function LoadSuiteFiles(directory: string): Model.SuiteFile[] {
  const files: Model.SuiteFile[] = []
  function Collect(current: string): void {
    const entries = Fs.readdirSync(current, { withFileTypes: true })
    entries.sort((left, right) => left.name.localeCompare(right.name))
    for (const entry of entries) {
      const absolute = Path.join(current, entry.name)
      if (entry.isDirectory()) {
        Collect(absolute)
        continue
      }
      if (!entry.isFile() || !entry.name.endsWith('.json')) continue
      const content = Fs.readFileSync(absolute, 'utf8')
      const path = Path.relative(directory, absolute).split(Path.sep).join('/')
      const first = path.split('/')[0]
      const dialect = Model.Dialects.some((draft) => draft.id === first) || first === 'latest' ? first : null
      files.push({ path, dialect, groups: ParseGroups(JSON.parse(content), absolute) })
    }
  }
  Collect(directory)
  return files
}
// ------------------------------------------------------------------
// ResolveOutputDirectory
// ------------------------------------------------------------------
function ResolveOutputDirectory(directory: string, sourceDirectory: string): string {
  const output = Path.resolve(directory)
  const source = Path.resolve(sourceDirectory)
  const outputToSource = Path.relative(output, source)
  const sourceToOutput = Path.relative(source, output)
  const Contains = (relative: string) => relative === '' || (!relative.startsWith(`..${Path.sep}`) && relative !== '..')
  const outputToWorkingDirectory = Path.relative(output, process.cwd())
  if (output === Path.parse(output).root || Contains(outputToWorkingDirectory) || Contains(outputToSource) || Contains(sourceToOutput)) {
    throw new Error('The segmented directory must not overlap the suite directory')
  }
  return output
}
// ------------------------------------------------------------------
// IsReportable
// ------------------------------------------------------------------
function IsReportable(group: Model.TestGroup): boolean {
  return !group.tags?.includes('format-annotation')
}
// ------------------------------------------------------------------
// RunValidation
// ------------------------------------------------------------------
function RunValidation(callback: ValidationCallback, dialect: string, group: Model.TestGroup, test: Model.TestCase): boolean | null {
  try {
    return callback(dialect, group.externalSchemas ?? {}, group.schema, test.data)
  } catch (error) {
    console.error(`Segment: validation callback failed (${dialect}, ${group.description ?? 'unnamed test'})`, error)
    return null
  }
}
// ------------------------------------------------------------------
// AddStatistics
// ------------------------------------------------------------------
function AddStatistics(statistics: Record<string, { passed: number; failed: number }>, dialect: string, keyword: string, passed: boolean): void {
  const key = `${dialect}/${keyword}`
  const entry = statistics[key] ?? { passed: 0, failed: 0 }
  entry[passed ? 'passed' : 'failed']++
  statistics[key] = entry
}
// ------------------------------------------------------------------
// AddDocument
// ------------------------------------------------------------------
function AddDocument(documents: Map<string, Model.TestGroup[]>, path: string, group: Model.TestGroup, tests: Model.TestCase[]): void {
  if (tests.length === 0) return
  const groups = documents.get(path) ?? []
  groups.push({ ...group, tests })
  documents.set(path, groups)
}
// ------------------------------------------------------------------
// WriteSegments
// ------------------------------------------------------------------
function WriteSegments(directory: string, documents: SegmentedDocuments, layout: 'split' | 'underscore'): void {
  Fs.rmSync(directory, { recursive: true, force: true })
  for (const status of ['passing', 'failing'] as const) {
    const output = status === 'passing' ? 'pass' : 'fail'
    for (const [path, groups] of documents[status]) {
      const failing = status === 'failing'
      const targetPath = layout === 'split' ? Path.join(directory, output, path) : Path.join(directory, failing ? Path.join(Path.dirname(path), `_${Path.basename(path)}`) : path)
      Fs.mkdirSync(Path.dirname(targetPath), { recursive: true })
      Fs.writeFileSync(targetPath, JSON.stringify(groups, null, 2))
    }
  }
}
// ------------------------------------------------------------------
// SegmentSuite
// ------------------------------------------------------------------
function SegmentSuite(callback: ValidationCallback, sourceDirectory: string, options: SegmentOptions): Report.SegmentReport {
  const files = LoadSuiteFiles(sourceDirectory)
  const dialects = options.dialects ?? Model.Dialects
  const documents: SegmentedDocuments = { passing: new Map(), failing: new Map() }
  const statistics: Record<string, { passed: number; failed: number }> = {}
  for (const file of files) {
    for (const group of file.groups) {
      const compatibleDialects = dialects.filter((draft) =>
        (!file.dialect || file.dialect === draft.id || (file.dialect === 'latest' && draft.id === 'v1')) &&
        Model.IsCompatible(group.compatibility, draft.id)
      )
      if (compatibleDialects.length === 0) continue
      const passing: Model.TestCase[] = []
      const failing: Model.TestCase[] = []
      const keyword = file.path.replace(/\.json$/, '')
      for (const test of group.tests) {
        let passes = true
        for (const dialect of compatibleDialects) {
          const result = RunValidation(callback, dialect.id, group, test)
          const passed = result !== null && result === test.valid
          if (IsReportable(group)) AddStatistics(statistics, dialect.id, keyword, passed)
          passes &&= passed
        }
        if (passes) passing.push(test)
        else failing.push(test)
      }
      AddDocument(documents.passing, file.path, group, passing)
      AddDocument(documents.failing, file.path, group, failing)
    }
  }
  const outputDirectory = ResolveOutputDirectory(options.segmentedDirectory, sourceDirectory)
  WriteSegments(outputDirectory, documents, options.layout ?? 'split')
  return Report.CreateReport(statistics, dialects, options.report ?? {})
}
// ------------------------------------------------------------------
// Segment
// ------------------------------------------------------------------
export async function Segment(callback: ValidationCallback, options: SegmentOptions): Promise<Report.SegmentReport> {
  const cloneDirectory = Path.resolve(options.cloneDirectory)
  await Clone.CloneTestSuite(cloneDirectory)
  const sourceDirectory = Path.join(cloneDirectory, SUITE_TEST_DIRECTORY)
  return SegmentSuite(callback, sourceDirectory, options)
}

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

// ------------------------------------------------------------------
// Report Types
// ------------------------------------------------------------------
interface ReportDialect {
  id: string
  label: string
}
export interface PassRate {
  passed: number
  failed: number
  total: number
  rate: number | null
  allPassed: boolean
}
export interface ReportOptions {
  ignoreRequired?: string[]
  ignoreOptional?: string[]
}
export interface SegmentReport {
  drafts: Record<string, PassRate>
  total: PassRate
  required: string
  optional: string
}
type KeywordStatistics = { passed: number; failed: number }
// ------------------------------------------------------------------
// CreatePassRate
// ------------------------------------------------------------------
function CreatePassRate(passed: number, failed: number): PassRate {
  const total = passed + failed
  return { passed, failed, total, rate: total === 0 ? null : Math.round((passed / total) * 10000) / 100, allPassed: total > 0 && failed === 0 }
}
// ------------------------------------------------------------------
// ReadStatistics
// ------------------------------------------------------------------
function ReadStatistics(statistics: Record<string, KeywordStatistics>, draft: string): PassRate {
  let passed = 0
  let failed = 0
  for (const [key, value] of Object.entries(statistics)) {
    if (!key.startsWith(`${draft}/`)) continue
    passed += value.passed
    failed += value.failed
  }
  return CreatePassRate(passed, failed)
}
// ------------------------------------------------------------------
// RenderTable
// ------------------------------------------------------------------
function NormalizeKeyword(keyword: string): string {
  return /^format\//.test(keyword) ? `optional/${keyword}` : keyword
}
function RenderTable(statistics: Record<string, KeywordStatistics>, dialects: readonly ReportDialect[], optional: boolean, ignored: readonly string[]): string {
  const rows = new Map<string, Record<string, KeywordStatistics>>()
  for (const key of Object.keys(statistics)) {
    const separator = key.indexOf('/')
    const draft = key.slice(0, separator)
    const keyword = key.slice(separator + 1)
    if (optional !== keyword.includes('/')) continue
    const normalized = NormalizeKeyword(keyword)
    const display = normalized.replace(/^optional\//, '')
    if (ignored.includes(display)) continue
    const row = rows.get(display) ?? {}
    const counts = statistics[key]
    const entry = row[draft] ?? { passed: 0, failed: 0 }
    entry.passed += counts.passed
    entry.failed += counts.failed
    row[draft] = entry
    rows.set(display, row)
  }
  const header = `| Spec | ${dialects.map((dialect) => dialect.label).join(' | ')} |`
  const separator = `|:-----|${dialects.map(() => ':--').join('|')}|`
  const output = [...rows].sort(([left], [right]) => left.localeCompare(right)).map(([keyword, entries]) => {
    const values = dialects.map((dialect) => {
      const counts = entries[dialect.id]
      if (!counts || counts.passed + counts.failed === 0) return '-'
      if (counts.failed === 0) return '✅'
      return `${counts.passed}/${counts.passed + counts.failed}`
    })
    return `| ${keyword} | ${values.join(' | ')} |`
  })
  return [header, separator, ...output].join('\n')
}
// ------------------------------------------------------------------
// CreateReport
// ------------------------------------------------------------------
export function CreateReport(statistics: Record<string, KeywordStatistics>, dialects: readonly ReportDialect[], options: ReportOptions): SegmentReport {
  const drafts: Record<string, PassRate> = {}
  let passed = 0
  let failed = 0
  for (const dialect of dialects) {
    const rate = ReadStatistics(statistics, dialect.id)
    drafts[dialect.id] = rate
    passed += rate.passed
    failed += rate.failed
  }
  return {
    drafts,
    total: CreatePassRate(passed, failed),
    required: RenderTable(statistics, dialects, false, options.ignoreRequired ?? []),
    optional: RenderTable(statistics, dialects, true, options.ignoreOptional ?? [])
  }
}

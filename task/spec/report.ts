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

import type { JSONSchemaTestSuite } from './types.ts'

// ------------------------------------------------------------------
// Draft ordering for table columns
// ------------------------------------------------------------------
const DRAFT_ORDER = ['draft3', 'draft4', 'draft6', 'draft7', 'draft2019-09', 'draft2020-12', 'v1'] as const
const DRAFT_LABELS: Record<string, string> = {
  'draft3': '3',
  'draft4': '4',
  'draft6': '6',
  'draft7': '7',
  'draft2019-09': '2019-09',
  'draft2020-12': '2020-12',
  'v1': 'v1'
}

// ------------------------------------------------------------------
// Normalize keyword
//
// Aligns keywords across drafts that restructured their directories.
// Edit this function if upstream developers change the layout again.
//
// Rules:
//   format/<x>          -> optional/format/<x>    (v1 moved optional/format/* to format/*)
//   proposals/<x>/...   -> proposals/<x>/...      (pass through)
//   optional/<x>        -> optional/<x>           (pass through)
//   <x>                 -> <x>                    (pass through — required keyword)
// ------------------------------------------------------------------

function normalizeKeyword(keyword: string): string {
  // v1 puts format files directly under the draft root — normalize to optional/format/*
  if (/^format\//.test(keyword)) return `optional/${keyword}`
  return keyword
}

// ------------------------------------------------------------------
// Cell value: '✅' | 'X/Y' | '-'
// ------------------------------------------------------------------
function cell(entry: { passed: number; total: number } | undefined): string {
  if (entry === undefined) return '-'
  if (entry.passed === entry.total) return '✅'
  return `${entry.passed}/${entry.total}`
}

// ------------------------------------------------------------------
// Render a markdown table
//
// rows: Map of displayName -> { [draft]: { passed, total } }
// ------------------------------------------------------------------
function renderTable(rows: Map<string, Partial<Record<string, { passed: number; total: number }>>>): string {
  const drafts = DRAFT_ORDER.filter((d) => [...rows.values()].some((r) => r[d] !== undefined))
  const header = `| Spec | ${drafts.map((d) => DRAFT_LABELS[d] ?? d).join(' | ')} |`
  const divider = `|:-----|${drafts.map(() => ':--').join('|')}|`
  const lines = [header, divider]
  for (const [name, draftMap] of [...rows.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const cells = drafts.map((d) => cell(draftMap[d])).join(' | ')
    lines.push(`| ${name} | ${cells} |`)
  }
  return lines.join('\n')
}
export interface ReportOptions {
  ignore?: string[]
}
// ------------------------------------------------------------------
// ReportRequired
//
// Only includes top-level keywords (no '/' in keyword).
// Display name is the keyword itself.
// ------------------------------------------------------------------
export function reportRequired(suite: JSONSchemaTestSuite, options: ReportOptions = { ignore: [] }): string {
  const ignored = new Set(options.ignore)
  const rows = new Map<string, Partial<Record<string, { passed: number; total: number }>>>()
  for (const [path, stats] of Object.entries(suite.report)) {
    const slash = path.indexOf('/')
    const draft = path.slice(0, slash)
    const keyword = path.slice(slash + 1)
    if (keyword.includes('/')) continue // skip optional/* and subdirs
    if (ignored.has(keyword)) continue // skip ignored keywords
    const row = rows.get(keyword) ?? {}
    row[draft] = { passed: stats.passed, total: stats.total }
    rows.set(keyword, row)
  }
  return renderTable(rows)
}
// ------------------------------------------------------------------
// ReportOptional
//
// Only includes keywords under subdirectories (keyword contains '/').
// Normalizes paths so v1/format/* aligns with other drafts' optional/format/*.
// Display name strips the leading 'optional/' prefix for readability.
// ------------------------------------------------------------------
export function reportOptional(suite: JSONSchemaTestSuite, options: ReportOptions = { ignore: [] }): string {
  const ignored = new Set(options.ignore)
  const rows = new Map<string, Partial<Record<string, { passed: number; total: number }>>>()
  for (const [path, stats] of Object.entries(suite.report)) {
    const slash = path.indexOf('/')
    const draft = path.slice(0, slash)
    const keyword = path.slice(slash + 1)
    if (!keyword.includes('/')) continue // skip required top-level keywords
    const normalized = normalizeKeyword(keyword)
    const displayName = normalized.replace(/^optional\//, '')
    if (ignored.has(displayName)) continue // skip ignored keywords (matched against display name)
    const row = rows.get(displayName) ?? {}
    row[draft] = { passed: stats.passed, total: stats.total }
    rows.set(displayName, row)
  }

  return renderTable(rows)
}

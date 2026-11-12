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
// Suite Model
// ------------------------------------------------------------------
export type SchemaContext = Record<string, unknown>
export type Schema = boolean | Record<string, unknown>
export interface TestCase {
  description?: string
  data: unknown
  valid: boolean
  [key: string]: unknown
}
export interface TestGroup {
  description?: string
  schema: Schema
  tests: TestCase[]
  compatibility?: string
  tags?: string[]
  externalSchemas?: SchemaContext
  [key: string]: unknown
}
export interface SuiteFile {
  path: string
  dialect: string | null
  groups: TestGroup[]
}
export interface Dialect {
  id: string
  label: string
}
// ------------------------------------------------------------------
// Dialects
// ------------------------------------------------------------------
export const Dialects: readonly Dialect[] = [
  { id: 'draft3', label: '3' },
  { id: 'draft4', label: '4' },
  { id: 'draft6', label: '6' },
  { id: 'draft7', label: '7' },
  { id: 'draft2019-09', label: '2019-09' },
  { id: 'draft2020-12', label: '2020-12' },
  { id: 'v1', label: 'v1' }
]
// ------------------------------------------------------------------
// IsCompatible
// ------------------------------------------------------------------
/**
 * Tests a suite compatibility expression against a JSON Schema draft ID.
 * Expressions use numeric suite releases: `<=3` is an upper bound, `=2019`
 * is an exact release, and `6` is a lower bound. An undefined expression
 * means the test applies to every draft.
 * @example IsCompatible('<=3', 'draft3') // true
 * @example IsCompatible('=2019', 'draft2019-09') // true
 * @example IsCompatible('6', 'draft7') // true
 */
export function IsCompatible(expression: string | undefined, draft: string): boolean {
  const match = /^draft(\d+)(?:-\d{2})?$/.exec(draft)
  const version = draft === 'v1' ? 9999 : match === null ? undefined : Number(match[1])
  if (version === undefined) throw new Error(`Invalid JSON Schema draft '${draft}'`)
  if (expression === undefined) return true
  let compatible = true
  for (const constraint of expression.split(',')) {
    const match = /^(<=|=)?(\d+)$/.exec(constraint)
    if (match === null) throw new Error(`Invalid compatibility constraint '${constraint}'`)
    const [, operator = '', value] = match
    const release = Number(value)
    switch (operator) {
      case '':
        compatible = version >= release
        break
      case '<=':
        compatible = version <= release
        break
      case '=':
        compatible = version === release
        break
    }
    if (version <= release) break
  }
  return compatible
}

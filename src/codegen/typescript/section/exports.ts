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

import { BuildResult } from '../../../schema/index.ts'
import { Writer } from '../../writer.ts'
import { Banner } from './banner.ts'

// ------------------------------------------------------------------
// Parse
// ------------------------------------------------------------------
function Parse(_build: BuildResult): string {
  const writer = new Writer()
  writer.WriteLine('export function Parse(value: unknown): Module.Static {')
  writer.WriteLine('  if(Check(value)) return value')
  writer.WriteLine(`  throw new ParseError(Schema(), value, Errors(value))`)
  writer.WriteLine('}')
  return writer.ToString()
}
// ------------------------------------------------------------------
// CheckWithUnevaluated
// ------------------------------------------------------------------
function UnevaluatedCheck(build: BuildResult): string {
  const writer = new Writer()
  writer.WriteLine('export function Check(value: unknown): value is Module.Static {')
  writer.WriteLine('  const context = new CheckContext({}, {})')
  writer.WriteLine(`  return ${build.Entry()}`)
  writer.WriteLine('}')
  return writer.ToString()
}
function Check(build: BuildResult): string {
  const writer = new Writer()
  writer.WriteLine('export function Check(value: unknown): value is Module.Static {')
  writer.WriteLine(`  return ${build.Entry()}`)
  writer.WriteLine('}')
  return writer.ToString()
}
function Errors(_build: BuildResult): string {
  const writer = new Writer()
  writer.WriteLine('export function Errors(value: unknown): [boolean, TLocalizedValidationError[]] {')
  writer.WriteLine(`  return SchemaErrors(Context(), Schema(), value)`)
  writer.WriteLine('}')
  return writer.ToString()
}
// ------------------------------------------------------------------
// ExportsSection
// ------------------------------------------------------------------
export function ExportsSection(build: BuildResult): string {
  const writer = new Writer()
  writer.WriteLine(Banner('Export'))
  writer.WriteLine(build.UseUnevaluated() ? UnevaluatedCheck(build) : Check(build))
  writer.WriteLine(Parse(build))
  writer.WriteLine(Errors(build))
  return writer.ToString()
}

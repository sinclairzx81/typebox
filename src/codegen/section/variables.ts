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

// deno-lint-ignore-file ban-types
// deno-fmt-ignore-file

import { Guard, GlobalsGuard } from '../../guard/index.ts'
import { Format } from '../../format/index.ts'
import * as Schema from '../../schema/index.ts'
import { Banner } from './banner.ts'

import { Writer } from '../writer.ts'
// ------------------------------------------------------------------
// AnnotateParameter
// ------------------------------------------------------------------
function AnnotateParameter(func: string): string {
  return func
    .replace(/\(value\)(\s*=>)/, '(value: any)$1')       // arrow: (value) => ...  or  (value)=>...
    .replace(/function(\s*)\(value\)/, 'function$1(value: any)') // function (value) { ... }
}
// ------------------------------------------------------------------
// FromFunction
// ------------------------------------------------------------------
function FromFunction(_build: Schema.BuildResult, variable: Function): string {
  return (
    Guard.IsEqual(variable, Format.IsDateTime) ? 'Format.IsDateTime' :
    Guard.IsEqual(variable, Format.IsDate) ? 'Format.IsDate' :
    Guard.IsEqual(variable, Format.IsDuration) ? 'Format.IsDuration' :
    Guard.IsEqual(variable, Format.IsEmail) ? 'Format.IsEmail' :
    Guard.IsEqual(variable, Format.IsHostname) ? 'Format.IsHostname' :
    Guard.IsEqual(variable, Format.IsIdnEmail) ? 'Format.IsIdnEmail' :
    Guard.IsEqual(variable, Format.IsIdnHostname) ? 'Format.IsIdnHostname' :
    Guard.IsEqual(variable, Format.IsIPv4) ? 'Format.IsIPv4' :
    Guard.IsEqual(variable, Format.IsIPv6) ? 'Format.IsIPv6' :
    Guard.IsEqual(variable, Format.IsIriReference) ? 'Format.IsIriReference' :
    Guard.IsEqual(variable, Format.IsIri) ? 'Format.IsIri' :
    Guard.IsEqual(variable, Format.IsJsonPointerUriFragment) ? 'Format.IsJsonPointerUriFragment' :
    Guard.IsEqual(variable, Format.IsJsonPointer) ? 'Format.IsJsonPointer' :
    Guard.IsEqual(variable, Format.IsRegex) ? 'Format.IsRegex' :
    Guard.IsEqual(variable, Format.IsRelativeJsonPointer) ? 'Format.IsRelativeJsonPointer' :
    Guard.IsEqual(variable, Format.IsTime) ? 'Format.IsTime' :
    Guard.IsEqual(variable, Format.IsUriReference) ? 'Format.IsUriReference' :
    Guard.IsEqual(variable, Format.IsUriTemplate) ? 'Format.IsUriTemplate' :
    Guard.IsEqual(variable, Format.IsUri) ? 'Format.IsUri' :
    Guard.IsEqual(variable, Format.IsUrl) ? 'Format.IsUrl' :
    Guard.IsEqual(variable, Format.IsUuid) ? 'Format.IsUuid' :
    AnnotateParameter(variable.toString())
  )
}
// ------------------------------------------------------------------
// FromRegExp
// ------------------------------------------------------------------
function FromRegExp(_build: Schema.BuildResult, variable: RegExp) {
  return variable
}
// ------------------------------------------------------------------
// FromUnknown
// ------------------------------------------------------------------
function FromUnknown(_build: Schema.BuildResult, variable: unknown) {
  return JSON.stringify(variable)
}
// ------------------------------------------------------------------
// FromVariable
// ------------------------------------------------------------------
function FromVariable(build: Schema.BuildResult, variable: unknown) {
  return (
    Guard.IsFunction(variable) ? FromFunction(build, variable) :
    GlobalsGuard.IsRegExp(variable) ? FromRegExp(build, variable) :
    FromUnknown(build, variable)
  )
}
export function VariableSection(build: Schema.BuildResult): string {
  const writer = new Writer()
  writer.WriteLine(Banner('External'))
  const mapped = build.External().variables.map(variable => FromVariable(build, variable))
  writer.WriteLine(`const ${build.External().identifier} = [${mapped.join(', ')}]`)
  return writer.ToString()
}
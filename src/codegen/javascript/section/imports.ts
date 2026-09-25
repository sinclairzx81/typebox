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
import { Guard } from '../../../guard/index.ts'
import { Format } from '../../../format/index.ts'

// ------------------------------------------------------------------
// UseFormat
// ------------------------------------------------------------------
function UseFormat(build: BuildResult): boolean {
  return build.External().variables.some((variable) => {
    return (
      Guard.IsEqual(variable, Format.IsDateTime) ||
      Guard.IsEqual(variable, Format.IsDate) ||
      Guard.IsEqual(variable, Format.IsDuration) ||
      Guard.IsEqual(variable, Format.IsEmail) ||
      Guard.IsEqual(variable, Format.IsHostname) ||
      Guard.IsEqual(variable, Format.IsIdnEmail) ||
      Guard.IsEqual(variable, Format.IsIdnHostname) ||
      Guard.IsEqual(variable, Format.IsIPv4) ||
      Guard.IsEqual(variable, Format.IsIPv6) ||
      Guard.IsEqual(variable, Format.IsIriReference) ||
      Guard.IsEqual(variable, Format.IsIri) ||
      Guard.IsEqual(variable, Format.IsJsonPointerUriFragment) ||
      Guard.IsEqual(variable, Format.IsJsonPointer) ||
      Guard.IsEqual(variable, Format.IsRegex) ||
      Guard.IsEqual(variable, Format.IsRelativeJsonPointer) ||
      Guard.IsEqual(variable, Format.IsTime) ||
      Guard.IsEqual(variable, Format.IsUriReference) ||
      Guard.IsEqual(variable, Format.IsUriTemplate) ||
      Guard.IsEqual(variable, Format.IsUri) ||
      Guard.IsEqual(variable, Format.IsUrl) ||
      Guard.IsEqual(variable, Format.IsUuid)
    )
  })
}
// ------------------------------------------------------------------
// UseHashing
// ------------------------------------------------------------------
function UseHashing(build: BuildResult): boolean {
  return build.Functions().join('\n').includes('Hashing.Hash')
}
// ------------------------------------------------------------------
// UseGuard
// ------------------------------------------------------------------
function UseGuard(build: BuildResult): boolean {
  return build.Functions().join('\n').includes('Guard.CodePointCount')
}
// ------------------------------------------------------------------
// ImportsSection
// ------------------------------------------------------------------
export function ImportsSection(build: BuildResult): string {
  const writer = new Writer()
  if (UseHashing(build)) writer.WriteLine(`import { Hashing } from 'typebox/system'`)
  if (UseFormat(build)) writer.WriteLine(`import * as F from 'typebox/format'`)
  if (UseGuard(build)) writer.WriteLine(`import * as G from 'typebox/guard'`)
  writer.WriteLine(`import * as S from 'typebox/schema'`)
  return writer.ToString()
}

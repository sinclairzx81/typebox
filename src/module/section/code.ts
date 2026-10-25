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

// deno-fmt-ignore-file

import * as BuildInfo from '../buildinfo/index.ts'

// ------------------------------------------------------------------
// Pattern
// ------------------------------------------------------------------
const IdStart = String.raw`[\p{ID_Start}_$]`
const IdPart = String.raw`[\p{ID_Continue}_$\u200C\u200D]`
const Identifier = String.raw`(?!(?:null|true|false)(?!${IdPart}))${IdStart}${IdPart}*`
const CallPattern = new RegExp(
  String.raw`(?<![\p{ID_Continue}$\u200C\u200D.])(Guard|Format|Hashing)\.(${IdStart}${IdPart}*)\(\s*(${Identifier})\s*\)`,
  'gu'
)
// ------------------------------------------------------------------
// Code
// ------------------------------------------------------------------
/** Transforms Code to use Module scoped Guard.*, Format.* and Hashing.* */
export function Code(info: BuildInfo.BuildInfo, code: string): string {
  const names: Record<string, string> = {
    Guard: info.NameOfGuard,
    Format: info.NameOfFormat,
    Hashing: info.NameOfHashing
  }
  return code.replace(CallPattern, (match, module: string, name: string, identifier: string) => 
    names[module] === module ? match : `${names[module]}.${name}(${identifier})`)
}

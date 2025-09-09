/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

import { type TLiteralValue } from '../../types/literal.ts'

// ------------------------------------------------------------------
//
// ConvertToIntegerKey
//
// TypeScript automatically coerces numeric-looking string values into 
// numbers when indexing array-like structures and deriving numeric keys 
// from objects. This function ensures indexer comparisons use the 
// converted numeric value instead of the original string.
//
// Used by both KeyOf and Index system types, it converts numeric-like 
// string values into integers when appropriate.
//
// ------------------------------------------------------------------

export type TConvertToIntegerKey<Value extends TLiteralValue,
  Normal extends string = `${Value}`,
  Result extends TLiteralValue = (
    Normal extends ` ${infer _ extends number}` ? Normal :
    Normal extends `${infer _ extends number} ` ? Normal :
    Normal extends `0${infer _ extends number}` ? Normal :
    Normal extends `-${infer _ extends number}` ? Normal :
    Normal extends `${infer Value extends number}` ? Value :
    Value
  )
> = Result

const integerKeyPattern = new RegExp('^(?:0|[1-9][0-9]*)$')

export function ConvertToIntegerKey<Value extends TLiteralValue>(value: Value): TConvertToIntegerKey<Value> {
  const normal = `${value}`
  return (
      integerKeyPattern.test(normal) 
      ? parseInt(normal)
      : value
  ) as never
}
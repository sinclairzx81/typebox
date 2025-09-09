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
// deno-lint-ignore-file

import { Guard } from '../../../guard/index.ts'

// ------------------------------------------------------------------
// Result
// ------------------------------------------------------------------
export type TResult<Value extends unknown = unknown> = 
  | TOk<Value> 
  | TFail

// ------------------------------------------------------------------
// Fail
// ------------------------------------------------------------------
export type TFail = undefined

// ------------------------------------------------------------------
// Ok
// ------------------------------------------------------------------
export type TOk<Value extends unknown = unknown> = {
  value: Value
}

// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export function IsOk<Result extends TResult>(value: Result): value is Exclude<Result, TFail> {
  return Guard.IsObject(value) && Guard.HasPropertyKey(value, 'value')
}

// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
export function Ok<Value extends unknown>(value: Value): TOk<Value> {
  return { value }
}
export function Fail(): undefined {
  return undefined
}
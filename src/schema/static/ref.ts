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

import type { XSchema } from '../types/schema.ts'
import type { XPointerGet } from '../pointer/pointer-get.ts'
import type { XStaticSchema } from './schema.ts'

// ------------------------------------------------------------------
// XCyclicGuard
// ------------------------------------------------------------------
type XCyclicCheck<Stack extends unknown[], MaxLength extends number, Buffer extends unknown[] = []> = (
  Stack extends [infer Left, ...infer Right]
    ? Buffer['length'] extends MaxLength
      ? false 
      : XCyclicCheck<Right, MaxLength, [...Buffer, Left]>
    : true
)
type XCyclicGuard<Stack extends unknown[], Ref extends string> = (
  Ref extends Stack[number] ? XCyclicCheck<Stack, 2> : true
)
// ------------------------------------------------------------------
// XNormal
// ------------------------------------------------------------------
type XNormal<Pointer extends string,
  Result extends string = (
    Pointer extends `#${infer Rest extends string}`
      ? Rest
      : Pointer
)> = Result
// ------------------------------------------------------------------
// XStaticRef
// ------------------------------------------------------------------
export type XStaticRef<Stack extends string[], Root extends XSchema, Ref extends string,
  Normal extends string = XNormal<Ref>,
  Target extends unknown = XPointerGet<Root, Normal>,
  Schema extends XSchema = Target extends XSchema ? Target : {},
  Result extends unknown = (
    XCyclicGuard<Stack, Ref> extends true
      ? XStaticSchema<[...Stack, Ref], Root, Schema>
      : any // terminate-recursive
)> = Result

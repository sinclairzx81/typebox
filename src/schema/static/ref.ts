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

import type { XSchema } from '../types/schema.ts'
import type { XStaticSchema } from './schema.ts'

// ------------------------------------------------------------------
// Cyclic - Protects against cyclic referencing
// ------------------------------------------------------------------
type CyclicStackLength<Stack extends unknown[], MaxLength extends number, Buffer extends unknown[] = []> = (
  Stack extends [infer Left, ...infer Right]
    ? Buffer['length'] extends MaxLength
      ? false 
      : CyclicStackLength<Right, MaxLength, [...Buffer, Left]>
    : true
)
type CyclicGuard<Stack extends unknown[], Ref extends string> = (
  Ref extends Stack[number] ? CyclicStackLength<Stack, 2> : true
)
// ------------------------------------------------------------------
// Normal - Discards Hash from a Pointer
// ------------------------------------------------------------------
type TNormal<Pointer extends string> = (
  Pointer extends `#${infer Rest extends string}`
    ? Rest
    : Pointer
)
// ------------------------------------------------------------------
// Escape - Escapes Index Components
// ------------------------------------------------------------------
type TEscape0<Index extends string> = (
  Index extends `${infer Left}~0${infer Right}` ? `${Left}~${TEscape<Right>}` :
  Index
)
type TEscape1<Index extends string> = (
  Index extends `${infer Left}~1${infer Right}` ? `${Left}/${TEscape<Right>}` :
  Index
)
type TEscape<Index extends string,
  Escaped0 extends string = TEscape0<Index>,
  Escaped1 extends string = TEscape1<Escaped0>,
> = Escaped1
// ------------------------------------------------------------------
// Indices - Gets Pointer Indices
// ------------------------------------------------------------------
type IndicesReduce<Pointer extends string, Result extends string[] = []> = (
  Pointer extends `${infer Left extends string}/${infer Right extends string}`
    ? Left extends ''
      ? IndicesReduce<Right, Result>
      : IndicesReduce<Right, [...Result, TEscape<Left>]>
    : [...Result, TEscape<Pointer>]
)
type TIndices<Pointer extends string,
  Normal extends string = TNormal<Pointer>,
  Result extends string[] = Normal extends '' 
    ? [] 
    : IndicesReduce<Normal>,
> = Result
// ------------------------------------------------------------------
// ResolveRef - Resolves Target Schema
// ------------------------------------------------------------------
type TResolveReducer<Schema extends unknown, Indices extends string[]> = (
  Indices extends [infer Left extends string, ...infer Right extends string[]]
    ? Left extends keyof Schema
      ? TResolveReducer<Schema[Left], Right>
      : {}
    : Schema
)
type TResolveRef<Schema extends unknown, Ref extends string,
  Indices extends string[] = TIndices<Ref>, // as pointer
  Target extends unknown = TResolveReducer<Schema, Indices>,
  Result extends XSchema = Target extends XSchema ? Target : {}
> = Result
// ------------------------------------------------------------------
// XStaticRef
// ------------------------------------------------------------------
export type XStaticRef<Stack extends string[], Root extends XSchema, Ref extends string,
  Schema extends XSchema = TResolveRef<Root, Ref>,
  Result extends unknown = (
    CyclicGuard<Stack, Ref> extends true
      ? XStaticSchema<[...Stack, Ref], Root, Schema>
      : any // terminate
  )
> = Result

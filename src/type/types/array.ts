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

import { Memory } from '../../system/memory/index.ts'
import { type StaticType, type StaticDirection } from './static.ts'
import { type TSchema, type TArrayOptions, IsKind } from './schema.ts'
import { type TProperties } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticArray<Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema,
  Result = StaticType<Direction, Context, This, Type>[]
> = Result
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents an Array type. */
export interface TArray<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'Array'
  type: 'array'
  items: Type
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates an Array type. */
export function Array<Type extends TSchema>(items: Type, options?: TArrayOptions): TArray<Type> {
  return Memory.Create({ '~kind': 'Array' }, { type: 'array', items }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TArray. */
export function IsArray(value: unknown): value is TArray {
  return IsKind(value, 'Array')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TArray. */
export function ArrayOptions(type: TArray): TArrayOptions {
  return Memory.Discard(type, ['~kind', 'type', 'items'])
}
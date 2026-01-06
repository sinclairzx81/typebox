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

import { Memory } from '../../system/memory/index.ts'
import { type StaticType } from './static.ts'
import { type TSchema, type TIntersectOptions, IsKind } from './schema.ts'
import { type TProperties } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticIntersect<Stack extends string[], Context extends TProperties, This extends TProperties, Types extends TSchema[], Result extends unknown = unknown> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? StaticIntersect<Stack, Context, This, Right, Result & StaticType<Stack, Context, This, Left>>
    : Result
)
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a logical Intersect type. */
export interface TIntersect<Types extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Intersect'
  allOf: Types
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Intersect type. */
export function Intersect<Types extends TSchema[]>(types: [...Types], options: TIntersectOptions = {}): TIntersect<Types> {
  return Memory.Create({ '~kind': 'Intersect' }, { allOf: types }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TIntersect. */
export function IsIntersect(value: unknown): value is TIntersect {
  return IsKind(value, 'Intersect')
}

// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TIntersect. */
export function IntersectOptions(type: TIntersect): TIntersectOptions {
  return Memory.Discard(type, ['~kind', 'allOf'])
}
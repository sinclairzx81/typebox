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
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'
import { type TProperties } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticUnion<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Types extends TSchema[], Result extends unknown = never> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? StaticUnion<Stack, Direction, Context, This, Right, Result | StaticType<Stack, Direction, Context, This, Left>>
    : Result
)
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a logical Union type. */
export interface TUnion<Types extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Union'
  anyOf: Types
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Union type. */
export function Union<Types extends TSchema[]>(anyOf: [...Types], options: TSchemaOptions = {}): TUnion<Types> {
  return Memory.Create({ '~kind': 'Union' }, { anyOf }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TUnion. */
export function IsUnion(value: unknown): value is TUnion {
  return IsKind(value, 'Union')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TUnion. */
export function UnionOptions(type: TUnion): TSchemaOptions {
  return Memory.Discard(type, ['~kind', 'anyOf'])
}
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
import { type StaticType } from './static.ts'
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'
import { type TProperties } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticIterator<Stack extends string[], Context extends TProperties, This extends TProperties, Type extends TSchema,
  Result = IterableIterator<StaticType<Stack, Context, This, Type>>
> = Result
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents an Iterator. */
export interface TIterator<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'Iterator'
  type: 'iterator'
  iteratorItems: Type
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Iterator type. */
export function Iterator<Type extends TSchema>(iteratorItems: Type, options?: TSchemaOptions): TIterator<Type> {
  return Memory.Create({ '~kind': 'Iterator' }, { type: 'iterator', iteratorItems }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TIterator. */
export function IsIterator(value: unknown): value is TIterator {
  return IsKind(value, 'Iterator')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TIterator. */
export function IteratorOptions(type: TIterator): TSchemaOptions {
  return Memory.Discard(type, ['~kind', 'type', 'iteratorItems'])
}
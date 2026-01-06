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
import { type StaticType, type StaticDirection } from './static.ts'
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'
import { type TProperties } from './properties.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticAsyncIterator<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema, 
  Result = AsyncIterableIterator<StaticType<Stack, Direction, Context, This, Type>>
> = Result
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a AsyncIterator. */
export interface TAsyncIterator<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'AsyncIterator'
  type: 'asyncIterator'
  iteratorItems: Type
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a AsyncIterator type. */
export function AsyncIterator<Type extends TSchema>(iteratorItems: Type, options?: TSchemaOptions): TAsyncIterator<Type> {
  return Memory.Create({ '~kind': 'AsyncIterator' }, { type: 'asyncIterator', iteratorItems }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TAsyncIterator */
export function IsAsyncIterator(value: unknown): value is TAsyncIterator {
  return IsKind(value, 'AsyncIterator')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TAsyncIterator. */
export function AsyncIteratorOptions(type: TAsyncIterator): TSchemaOptions {
  return Memory.Discard(type, ['~kind', 'type', 'iteratorItems'])
}
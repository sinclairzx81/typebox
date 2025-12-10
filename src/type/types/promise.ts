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
export type StaticPromise<Stack extends string[], Context extends TProperties, This extends TProperties, Type extends TSchema, 
  Result = Promise<StaticType<Stack, Context, This, Type>>
> = Result
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a Promise type. */
export interface TPromise<Type extends TSchema = TSchema> extends TSchema {
  '~kind': 'Promise'
  type: 'promise'
  item: Type
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Promise type. */
export function Promise<Type extends TSchema>(item: Type, options?: TSchemaOptions): TPromise<Type> {
  return Memory.Create({ ['~kind']: 'Promise' }, { type: 'promise', item }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given type is TPromise. */
export function IsPromise(value: unknown): value is TPromise {
  return IsKind(value, 'Promise')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TPromise. */
export function PromiseOptions(type: TPromise): TSchemaOptions {
  return Memory.Discard(type, ['~kind', 'type', 'item'])
}
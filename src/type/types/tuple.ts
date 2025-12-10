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
import { type TSchema, type TTupleOptions, IsKind } from './schema.ts'
import { type TArray } from './array.ts'
import { type TOptional } from './_optional.ts'
import { type TProperties } from './properties.ts'
import { type TImmutable } from './_immutable.ts'
import { type TReadonly } from './_readonly.ts'
import { type TRest } from './rest.ts'

// ------------------------------------------------------------------
// StaticLast
//
// Handles the special case where the last element of a Tuple list
// may be a TRest<TArray<...>> type. In standard Tuples, Rest elements
// are spread during instantiation. However, Function and Constructor
// types do not spread their Parameters directly. Since these types
// infer their Parameters using Tuples, it is necessary to perform
// unsized Parameter inference at the Tuple level.
//
// ------------------------------------------------------------------
type StaticLast<Stack extends string[], Context extends TProperties, This extends TProperties, Type extends TSchema, Result extends unknown[]> = (
  Type extends TRest<infer RestType extends TSchema>
   ? RestType extends TArray<infer ArrayType extends TSchema>
     ? [...Result, ...TStaticElement<Stack, Context, This, ArrayType>[0][]]
     : [...Result, never]
   : [...Result, ...TStaticElement<Stack, Context, This, Type>]
)
// ------------------------------------------------------------------
// StaticElement
// ------------------------------------------------------------------
type TStaticElement<Stack extends string[], Context extends TProperties, This extends TProperties, Type extends TSchema,
  IsReadonly extends boolean = Type extends TReadonly ? true : false,
  IsOptional extends boolean = Type extends TOptional ? true : false,
  Inferred extends unknown = StaticType<Stack, Context, This, Type>,
  Result extends [unknown?] = (
    [IsReadonly, IsOptional] extends [true, true] ? [Readonly<Inferred>?] :
    [IsReadonly, IsOptional] extends [false, true] ? [Inferred?] :
    [IsReadonly, IsOptional] extends [true, false] ? [Readonly<Inferred>] :
    [Inferred]
   )
> = Result
// ------------------------------------------------------------------
// StaticElements
// ------------------------------------------------------------------
export type TStaticElements<Stack extends string[], Context extends TProperties, This extends TProperties, Types extends TSchema[], Result extends unknown[] = []> = (
  Types extends [infer Last extends TSchema] ? StaticLast<Stack, Context, This, Last, Result> :
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TStaticElements<Stack, Context, This, Right, [...Result, ...TStaticElement<Stack, Context, This, Left>]>
    : Result
)
// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticTuple<Stack extends string[], Context extends TProperties, This extends TProperties, Tuple extends TSchema, Items extends TSchema[], 
  Elements extends unknown[] = TStaticElements<Stack, Context, This, Items>,
  Result extends readonly unknown[] = (
    Tuple extends TImmutable 
      ? readonly [...Elements] 
      : Elements
  )
> = Result
// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
/** Represents a Tuple type. */
export interface TTuple<Types extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Tuple'
  type: 'array',
  additionalItems: false,
  items: Types
  minItems: Types['length']
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Tuple type. */
export function Tuple<Types extends TSchema[]>(types: [...Types], options: TTupleOptions = {}): TTuple<Types> {
const [items, minItems, additionalItems] = [types, types.length, false]
  return Memory.Create({ ['~kind']: 'Tuple' }, { type: 'array', additionalItems, items, minItems }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TTuple. */
export function IsTuple(value: unknown): value is TTuple {
  return IsKind(value, 'Tuple')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TTuple. */
export function TupleOptions(type: TTuple): TTupleOptions {
  return Memory.Discard(type, ['~kind', 'type', 'items', 'minItems', 'additionalItems'])
}
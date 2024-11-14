/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { CreateType } from '../create/type'
import { Ensure } from '../helpers/index'
import type { TSchema, SchemaOptions } from '../schema/index'
import { Computed, type TComputed } from '../computed/index'
import { Intersect, type TIntersect } from '../intersect/index'
import { Union, type TUnion } from '../union/index'
import { type TPromise } from '../promise/index'
import { Ref, type TRef } from '../ref/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsIntersect, IsUnion, IsPromise, IsRef, IsComputed } from '../guard/kind'

// ----------------------------------------------------------------
// FromComputed
// ----------------------------------------------------------------
// prettier-ignore
type TFromComputed<Target extends string, Parameters extends TSchema[]> = Ensure<(
  TComputed<'Awaited', [TComputed<Target, Parameters>]>
)>
// prettier-ignore
function FromComputed<Target extends string, Parameters extends TSchema[]>(target: Target, parameters: Parameters): TFromComputed<Target, Parameters> {
  return Computed('Awaited', [Computed(target, parameters)]) as never
}
// ----------------------------------------------------------------
// Ref
// ----------------------------------------------------------------
type TFromRef<Ref extends string> = Ensure<TComputed<'Awaited', [TRef<Ref>]>>
// prettier-ignore
function FromRef<Ref extends string>($ref: Ref): TFromRef<Ref> {
  return Computed('Awaited', [Ref($ref)]) as never
}
// ----------------------------------------------------------------
// FromIntersect
// ----------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Types extends TSchema[]> = (
  TIntersect<TFromRest<Types>>
)
// prettier-ignore
function FromIntersect<Types extends TSchema[]>(types: [...Types]): TFromIntersect<Types> {
  return Intersect(FromRest(types) as TSchema[]) as never
}
// ----------------------------------------------------------------
// FromUnion
// ----------------------------------------------------------------
// prettier-ignore
type TFromUnion<Types extends TSchema[]> = TUnion<TFromRest<Types>>
// prettier-ignore
function FromUnion<Types extends TSchema[]>(types: [...Types]): TFromUnion<Types> {
  return Union(FromRest(types) as TSchema[]) as never
}
// ----------------------------------------------------------------
// Promise
// ----------------------------------------------------------------
type TFromPromise<Type extends TSchema> = TAwaited<Type>
// prettier-ignore
function FromPromise<Type extends TSchema>(type: Type): TFromPromise<Type> {
  return Awaited(type) as never
}
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromRest<Right, [...Result, TAwaited<Left>]>
    : Result
)
// prettier-ignore
function FromRest<Types extends TSchema[]>(types: [...Types]) : TFromRest<Types> {
  return types.map(type => Awaited(type)) as never
}
// ------------------------------------------------------------------
// TAwaited
// ------------------------------------------------------------------
// prettier-ignore
export type TAwaited<Type extends TSchema> = (
  Type extends TComputed<infer Target extends string, infer Parameters extends TSchema[]> ? TFromComputed<Target, Parameters> :
  Type extends TRef<infer Ref extends string> ? TFromRef<Ref> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TFromRest<Types>> :
  Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TFromRest<Types>> :
  Type extends TPromise<infer Type extends TSchema> ? TAwaited<Type> :
  Type
)
/** `[JavaScript]` Constructs a type by recursively unwrapping Promise types */
export function Awaited<T extends TSchema>(type: T, options?: SchemaOptions): TAwaited<T> {
  return CreateType(
    IsComputed(type) ? FromComputed(type.target, type.parameters) : IsIntersect(type) ? FromIntersect(type.allOf) : IsUnion(type) ? FromUnion(type.anyOf) : IsPromise(type) ? FromPromise(type.item) : IsRef(type) ? FromRef(type.$ref) : type,
    options,
  ) as never
}

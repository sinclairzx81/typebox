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

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TAny, IsAny } from '../../types/any.ts'
import { type TArray, IsArray } from '../../types/array.ts'
import { type TCyclic, IsCyclic } from '../../types/cyclic.ts'
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TNever, Never } from '../../types/never.ts'
import { type TObject, IsObject } from '../../types/object.ts'
import { type TRecord, IsRecord } from '../../types/record.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TKeyOfDeferred, KeyOfDeferred } from '../../action/keyof.ts'
import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'

import { type TCollapseToObject, CollapseToObject } from '../object/index.ts'

// ------------------------------------------------------------------
// Computed
// ------------------------------------------------------------------
import { type TFromAny, FromAny } from './from-any.ts'
import { type TFromArray, FromArray } from './from-array.ts'
import { type TFromObject, FromObject } from './from-object.ts'
import { type TFromRecord, FromRecord } from './from-record.ts'
import { type TFromTuple, FromTuple } from './from-tuple.ts'
// ------------------------------------------------------------------
//
// NormalizeType: TObject<{}> TCyclic | TIntersect | TUnion Only
//
// Note: We do not include TTuple in KeyOf normalization because
// we cannot rely on TypeScript to seqeuence collapsed keys in
// the correct order. Instead we use Tuple-length destructuring
// to yield TUnion ordering (review)
//
// Relates: TKeyOf | TIndex
//
// ------------------------------------------------------------------
type TNormalizeType<Type extends TSchema,
  Result extends TSchema = (
    Type extends TCyclic | TIntersect | TUnion ? TCollapseToObject<Type> :
    Type
  )
> = Result
function NormalizeType<Type extends TSchema>(type: Type): TNormalizeType<Type> {
  const result = (
    IsCyclic(type) || IsIntersect(type) || IsUnion(type) ? CollapseToObject(type) :
    type
  )
  return result as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
export type TKeyOfAction<Type extends TSchema, 
  Normal extends TSchema = TNormalizeType<Type>
> = (
  Normal extends TAny ? TFromAny :
  Normal extends TArray<infer Type extends TSchema> ? TFromArray<Type> :
  Normal extends TObject<infer Properties extends TProperties> ? TFromObject<Properties> :
  Normal extends TRecord ? TFromRecord<Normal> :
  Normal extends TTuple<infer Types extends TSchema[]> ? TFromTuple<Types> :
  TNever
)
export function KeyOfAction<Type extends TSchema>(type: Type): TKeyOfAction<Type> {
  const normal = NormalizeType(type)
  return (
    IsAny(normal) ? FromAny() :
    IsArray(normal) ? FromArray(normal.items) :
    IsObject(normal) ? FromObject(normal.properties) :
    IsRecord(normal) ? FromRecord(normal) :
    IsTuple(normal) ? FromTuple(normal.items) :
    Never()
  ) as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
export type TKeyOfImmediate<Context extends TProperties, State extends TState, Type extends TSchema, 
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TKeyOfAction<InstantiatedType>

export function KeyOfImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TKeyOfImmediate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(KeyOfAction(instantiatedType), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TKeyOfInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> = 
  TCanInstantiate<Context, [Type]> extends true 
    ? TKeyOfImmediate<Context, State, Type>
    : TKeyOfDeferred<Type>

export function KeyOfInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TKeyOfInstantiate<Context, State, Type> {
  return (
    CanInstantiate(context, [type])
      ? KeyOfImmediate(context, state, type, options)
      : KeyOfDeferred(type, options)
  ) as never
}
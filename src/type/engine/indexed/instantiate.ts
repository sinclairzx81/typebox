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

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TCyclic, IsCyclic } from '../../types/cyclic.ts'
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'
import { type TIndexDeferred, IndexDeferred } from '../../action/indexed.ts'
import { type TCollapseToObject, CollapseToObject } from '../object/index.ts'

import { type TFromType, FromType } from './from-type.ts'

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
export type TIndexAction<Type extends TSchema, Indexer extends TSchema, 
  Result extends TSchema = TCanInstantiate<[Type, Indexer]> extends true 
    ? TFromType<TNormalizeType<Type>, Indexer>
    : TIndexDeferred<Type, Indexer>
> = Result
export function IndexAction<Type extends TSchema, Indexer extends TSchema>(type: Type, indexer: Indexer, options: TSchemaOptions): TIndexAction<Type, Indexer> {
  const result = CanInstantiate([type, indexer])
    ? Memory.Update(FromType(NormalizeType(type), indexer), {}, options)
    : IndexDeferred(type, indexer, options)
  return result as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TIndexInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>,
  InstantiatedIndexer extends TSchema = TInstantiateType<Context, State, Indexer>,
> = TIndexAction<InstantiatedType, InstantiatedIndexer>

export function IndexInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema>
  (context: Context, state: State, type: Type, indexer: Indexer, options: TSchemaOptions): 
    TIndexInstantiate<Context, State, Type, Indexer> {
  const instantiatedType = InstantiateType(context, state, type)
  const instantiatedIndexer = InstantiateType(context, state, indexer)
  return IndexAction(instantiatedType, instantiatedIndexer, options)
}
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
// deno-lint-ignore-file ban-types

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TNumber, Number } from '../../types/number.ts'
import { type TArray, IsArray } from '../../types/array.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'
import { type TLiteral, Literal } from '../../types/literal.ts'
import { type TKeyValue, KeyValue } from '../../types/_key_value.ts'

import { type TIndexDeferred, IndexDeferred } from '../../action/indexed.ts'

import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'
import { type TExtends, Extends, ExtendsResult } from '../../extends/index.ts'
import { type TEvaluateUnionFast, EvaluateUnionFast } from '../evaluate/evaluate.ts'
import { type TKeyValues, KeyValues } from '../key_value/key_values.ts'

// ------------------------------------------------------------------
// IndexFromKeyValues
// ------------------------------------------------------------------
type TIndexFromKeyValues<KeyValues extends TKeyValue[], Indexer extends TSchema, Result extends TSchema[] = []> = (
  KeyValues extends [infer Left extends TKeyValue, ...infer Right extends TKeyValue[]]
    ? TExtends<{}, Left['key'], Indexer> extends ExtendsResult.TExtendsTrueLike
      ? TIndexFromKeyValues<Right, Indexer, [...Result, Left['value']]>
      : TIndexFromKeyValues<Right, Indexer, Result> 
    : Result
)
function IndexFromKeyValues<KeyValues extends TKeyValue[], Indexer extends TSchema>
  (keyValues: [...KeyValues], indexer: Indexer): TIndexFromKeyValues<KeyValues, Indexer> {
  return keyValues.reduce<TSchema[]>((result, left) => {
    return ExtendsResult.Match(Extends({}, left['key'], indexer), () => 
      [...result, left['value']] as TSchema[],
      () => result) as TSchema[]
  }, []) as never
}
// ------------------------------------------------------------------
// AdditionalKeyValues
// ------------------------------------------------------------------
type TAdditionalKeyValues<Type extends TSchema, Result extends TKeyValue[] = (
  Type extends TArray<TSchema> ? [TKeyValue<TLiteral<'length'>, TNumber>] :
  Type extends TTuple<TSchema[]> ? [TKeyValue<TLiteral<'length'>, TLiteral<Type['items']['length']>>] :
  []
)> = Result
function AdditionalKeyValues<Type extends TSchema>(type: Type): TAdditionalKeyValues<Type> {
  return (
    IsArray(type) ? [KeyValue(Literal('length'), Number())] :
    IsTuple(type) ? [KeyValue(Literal('length'), Literal(type['items']['length']))] :
    []
  ) as never
}
// ------------------------------------------------------------------
// Operation
// ------------------------------------------------------------------
type TIndexOperation<Type extends TSchema, Indexer extends TSchema,
  KeyValues extends TKeyValue[] = TKeyValues<{}, Type>,
  AdditionalKeyValues extends TKeyValue[] = TAdditionalKeyValues<Type>,
  Indexed extends TSchema[] = TIndexFromKeyValues<[...KeyValues, ...AdditionalKeyValues], Indexer>,
  Result extends TSchema = TEvaluateUnionFast<Indexed>
> = Result
function IndexOperation<Type extends TSchema, Indexer extends TSchema>
  (type: Type, indexer: Indexer): TIndexOperation<Type, Indexer> {
  const keyValues = KeyValues({}, type) as TKeyValue[]
  const additionalKeyValues = AdditionalKeyValues(type) as TKeyValue[]
  const indexed = IndexFromKeyValues([...keyValues, ...additionalKeyValues], indexer)
  const result = EvaluateUnionFast(indexed)
  return result as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
export type TIndexAction<Type extends TSchema, Indexer extends TSchema, 
  Result extends TSchema = TCanInstantiate<[Type, Indexer]> extends true 
    ? TIndexOperation<Type, Indexer>
    : TIndexDeferred<Type, Indexer>
> = Result
export function IndexAction<Type extends TSchema, Indexer extends TSchema>(type: Type, indexer: Indexer, options: TSchemaOptions): TIndexAction<Type, Indexer> {
  const result = CanInstantiate([type, indexer])
    ? Memory.Update(IndexOperation(type, indexer), {}, options)
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
  return IndexAction(instantiatedType, instantiatedIndexer, options) as never
}
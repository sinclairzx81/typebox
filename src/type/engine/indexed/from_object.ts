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

import { type TProperties } from '../../types/properties.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TNumber, IsNumber } from '../../types/number.ts'
import { type TNever, Never } from '../../types/never.ts'
import { type TPropertyKeys, PropertyKeys } from '../../types/properties.ts'
import { type TEvaluateUnion, EvaluateUnion } from '../evaluate/evaluate.ts'
import { type TToIndexableKeys, ToIndexableKeys } from '../indexable/to_indexable_keys.ts'

import { IntegerKey } from '../../types/record.ts'
import { type TExpandThis, ExpandThis } from '../this/expand_this.ts'
// ------------------------------------------------------------------
// IndexProperty
// ------------------------------------------------------------------
type TIndexProperty<Properties extends TProperties, Key extends string,
  // note: we are trying to normalize the key to support numeric lookup via string (revise)
  CanonicalKey extends string = keyof Properties extends string | number ? `${keyof Properties}` : never,
  SelectedType extends TSchema = Key extends CanonicalKey ? Properties[Key] : TNever,
  Result extends TSchema = TExpandThis<Properties, SelectedType>,
> = Result
function IndexProperty<Properties extends TProperties, Key extends string>
  (properties: Properties, key: Key): 
    TIndexProperty<Properties, Key> {
  const selectedType = key in properties ? properties[key] : Never()
  const result = ExpandThis(properties, selectedType)
  return result as never
}
// ------------------------------------------------------------------
// IndexProperties
// ------------------------------------------------------------------
type TIndexProperties<Properties extends TProperties, Keys extends string[], Result extends TSchema[] = []> = (
  Keys extends [infer Left extends string, ...infer Right extends string[]]
    ? TIndexProperties<Properties, Right, [...Result, TIndexProperty<Properties, Left>]>
    : Result
)
function IndexProperties<Properties extends TProperties, Keys extends string[]>
  (properties: Properties, keys: [...Keys]): 
    TIndexProperties<Properties, Keys> {
  return keys.reduce((result, left) => {
    return [...result, IndexProperty(properties, left)]
  }, [] as TSchema[]) as never
}
// ------------------------------------------------------------------
// FromIndexer
// ------------------------------------------------------------------
type TFromIndexer<Properties extends TProperties, Indexer extends TSchema,
  Keys extends string[] = TToIndexableKeys<Indexer>,
  Variants extends TSchema[] = TIndexProperties<Properties, Keys>,
  Result extends TSchema = TEvaluateUnion<Variants>
> = Result
function FromIndexer<Properties extends TProperties, Indexer extends TSchema>(properties: Properties, indexer: Indexer): TFromIndexer<Properties, Indexer> {
  const keys = ToIndexableKeys(indexer) as string[]
  const variants = IndexProperties(properties, keys)
  const result = EvaluateUnion(variants)
  return result as never
}
// ------------------------------------------------------------------
// FromIndexerNumber
//
// A TTuple will collapse to TObject in the context of a TMapped
// type expression so we need to support [number] indexing on
// a TObject type. This satisfies the following case.
//
//  type Map<T extends unknown[]> = { 
//    [K in keyof T]: K 
//  }[number] <-- here
//
// ------------------------------------------------------------------
type TNumericKeys<Keys extends string[], Result extends string[] = []> = (
  Keys extends [infer Left extends string, ...infer Right extends string[]]
    ? Left extends `${infer _ extends number}` 
      ? TNumericKeys<Right, [...Result, Left]> 
      : TNumericKeys<Right, Result> 
    : Result
)
const NumericKeyPattern = new RegExp(IntegerKey)
function NumericKeys<Keys extends string[]>(keys: [...Keys]): TNumericKeys<Keys> {
  const result = keys.filter(key => NumericKeyPattern.test(key))
  return result as never
}
type TFromIndexerNumber<Properties extends TProperties,
  Keys extends string[] = TPropertyKeys<Properties>,
  NumericKeys extends string[] = TNumericKeys<Keys>,
  Variants extends TSchema[] = TIndexProperties<Properties, NumericKeys>,
  Result extends TSchema = TEvaluateUnion<Variants>
> = Result
function FromIndexerNumber<Properties extends TProperties>(properties: Properties): TFromIndexerNumber<Properties> {
  const keys = PropertyKeys(properties) as string[]
  const numericKeys = NumericKeys(keys)
  const variants = IndexProperties(properties, numericKeys)
  const result = EvaluateUnion(variants)
  return result as never
}
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
export type TFromObject<Properties extends TProperties, Indexer extends TSchema,
  Result extends TSchema = Indexer extends TNumber ? TFromIndexerNumber<Properties> : TFromIndexer<Properties, Indexer>
> = Result
export function FromObject<Properties extends TProperties, Indexer extends TSchema>(properties: Properties, indexer: Indexer): TFromObject<Properties, Indexer> {
  const result = IsNumber(indexer) ? FromIndexerNumber(properties) : FromIndexer(properties, indexer)
  return result as never
}
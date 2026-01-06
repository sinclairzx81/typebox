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
import { type TEvaluateUnion, EvaluateUnion } from '../evaluate/evaluate.ts'
import { type TToIndexableKeys, ToIndexableKeys } from '../indexable/to-indexable-keys.ts'

// ------------------------------------------------------------------
// SelectProperty
// ------------------------------------------------------------------
type TSelectProperty<Properties extends TProperties, Key extends string,
  PropertyKey extends string = keyof Properties extends string | number ? `${keyof Properties}` : never,
  Result extends TSchema[] = Key extends PropertyKey ? [Properties[Key]] : []
> = Result
function SelectProperty<Properties extends TProperties, Indexer extends string>(properties: Properties, indexer: Indexer): TSelectProperty<Properties, Indexer> {
  const result = indexer in properties ? [properties[indexer]] : []
  return result as never
}
// ------------------------------------------------------------------
// SelectProperties
// ------------------------------------------------------------------
type TSelectProperties<Properties extends TProperties, Keys extends string[], Result extends TSchema[] = []> = (
  Keys extends [infer Left extends string, ...infer Right extends string[]]
    ? TSelectProperties<Properties, Right, [...Result, ...TSelectProperty<Properties, Left>]>
    : Result
)
function SelectProperties<Properties extends TProperties, Keys extends string[]>(properties: Properties, indexer: [...Keys]): TSelectProperties<Properties, Keys> {
  return indexer.reduce((result, left) => {
    return [...result, ...SelectProperty(properties, left)]
  }, [] as TSchema[]) as never
}
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
export type TFromObject<Properties extends TProperties, Indexer extends TSchema,
  Keys extends string[] = TToIndexableKeys<Indexer>,
  Variants extends TSchema[] = TSelectProperties<Properties, Keys>,
  Result extends TSchema = TEvaluateUnion<Variants>
> = Result
export function FromObject<Properties extends TProperties, Indexer extends TSchema>(properties: Properties, indexer: Indexer): TFromObject<Properties, Indexer> {
  const keys = ToIndexableKeys(indexer) as string[]
  const variants = SelectProperties(properties, keys)
  const result = EvaluateUnion(variants)
  return result as never
}
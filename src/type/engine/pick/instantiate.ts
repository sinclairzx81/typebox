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
import { Guard } from '../../../guard/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TObject, Object } from '../../types/object.ts'
import { type TToIndexableKeys, ToIndexableKeys } from '../indexable/to-indexable-keys.ts'
import { type TToIndexable, ToIndexable } from '../indexable/to-indexable.ts'

import { type TPickDeferred, PickDeferred } from '../../action/pick.ts'
import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'

// ------------------------------------------------------------------
// TComparable
// ------------------------------------------------------------------
// Pick requires a special comparer for the extends key check. We 
// convert the propertyKey into a string representation as the
// indexer is assured to be of type string[]
type TComparable<Indexable extends TProperties> = keyof Indexable extends string | number ? `${keyof Indexable}` : never
// ------------------------------------------------------------------
// FromKeys
// ------------------------------------------------------------------
type TFromKeys<Indexable extends TProperties, Keys extends string[], Result extends TProperties = {}> = (
  Keys extends [infer Left extends string, ...infer Right extends string[]]
    ? Left extends TComparable<Indexable>
      ? TFromKeys<Indexable, Right, Memory.TAssign<Result, { [_ in Left]: Indexable[Left] }>>
      : TFromKeys<Indexable, Right, Result>
    : Result
)
function FromKeys<Indexable extends TProperties, Keys extends string[]>(properties: Indexable, keys: Keys): TFromKeys<Indexable, Keys> {
  const result = Guard.Keys(properties).reduce((result, key) => {
    return keys.includes(key) ? Memory.Assign(result, { [key]: properties[key] }) : result
  }, {} as TProperties)
  return result as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
type TPickAction<Type extends TSchema, Indexer extends TSchema, 
  Indexable extends TProperties = TToIndexable<Type>,
  Keys extends string[] = TToIndexableKeys<Indexer>,
  Applied extends TProperties = TFromKeys<Indexable, Keys>,
  Result extends TSchema = TObject<Applied>
> = Result
function PickAction<Type extends TSchema, Indexer extends TSchema>
  (type: Type, indexer: Indexer): 
    TPickAction<Type, Indexer> {
  const indexable = ToIndexable(type) as TProperties
  const keys = ToIndexableKeys(indexer)
  const applied = FromKeys(indexable, keys)
  const result = Object(applied)
  return result as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TPickImmediate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema, 
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>,
  InstantiatedIndexer extends TSchema = TInstantiateType<Context, State, Indexer>,
> = TPickAction<InstantiatedType, InstantiatedIndexer>

function PickImmediate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema>
  (context: Context, state: State, type: Type, indexer: Indexer, options: TSchemaOptions): 
    TPickImmediate<Context, State, Type, Indexer> {
  const instantiatedType = InstantiateType(context, state, type)
  const instantiatedIndexer = InstantiateType(context, state, indexer)
  return Memory.Update(PickAction(instantiatedType, instantiatedIndexer), {}, options) as never
}
// ------------------------------------------------------------------
// PickInstantiate
// ------------------------------------------------------------------
export type TPickInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema> 
  = TCanInstantiate<Context, [Type, Indexer]> extends true
    ? TPickImmediate<Context, State, Type, Indexer>
    : TPickDeferred<Type, Indexer>

export function PickInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema>
  (context: Context, state: State, type: Type, indexer: Indexer, options: TSchemaOptions): 
    TPickInstantiate<Context, State, Type, Indexer> {
  return (
    CanInstantiate(context, [type, indexer])
      ? PickImmediate(context, state, type, indexer, options)
      : PickDeferred(type, indexer, options)
  ) as never
}
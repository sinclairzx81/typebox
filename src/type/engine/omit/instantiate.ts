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
import { Guard } from '../../../guard/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TObject, Object } from '../../types/object.ts'
import { type TToIndexableKeys, ToIndexableKeys } from '../indexable/to-indexable-keys.ts'
import { type TToIndexable, ToIndexable } from '../indexable/to-indexable.ts'
import { type TOmitDeferred, OmitDeferred } from '../../action/omit.ts'

import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'

// ------------------------------------------------------------------
// NormalKeys
// ------------------------------------------------------------------
type TNormalKeys<Keys extends string[],
 UnionKeys extends string = Keys[number],
 Result extends string | number = (
    UnionKeys extends `${infer Value extends number}` 
      ? UnionKeys | Value 
      : UnionKeys
 )
> = Result
// ------------------------------------------------------------------
// FromKeys
// ------------------------------------------------------------------
type TFromKeys<Properties extends TProperties, Keys extends string[],
  Omitted extends TProperties = Omit<Properties, TNormalKeys<Keys>>,
  Result extends TProperties = { [Key in keyof Omitted]: Omitted[Key] }
> = Result

function FromKeys<Properties extends TProperties, Keys extends string[]>(properties: Properties, keys: Keys): TFromKeys<Properties, Keys> {
  const result = Guard.Keys(properties).reduce((result, key) => {
    return keys.includes(key) ? result : { ...result, [key]: properties[key] }
  }, {} as TProperties)
  return result as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
type TOmitAction<Type extends TSchema, Indexer extends TSchema, 
  Indexable extends TProperties = TToIndexable<Type>,
  IndexableKeys extends string[] = TToIndexableKeys<Indexer>,
  Omitted extends TProperties = TFromKeys<Indexable, IndexableKeys>,
  Result extends TSchema = TObject<Omitted>
> = Result
function OmitAction<Type extends TSchema, Indexer extends TSchema>(type: Type, indexer: Indexer): TOmitAction<Type, Indexer> {
  const indexable = ToIndexable(type) as TProperties
  const indexableKeys = ToIndexableKeys(indexer)
  const omitted = FromKeys(indexable, indexableKeys)
  const result = Object(omitted)
  return result as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TOmitImmediate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema, 
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>,
  InstantiatedIndexer extends TSchema = TInstantiateType<Context, State, Indexer>,
  Result extends TSchema = TOmitAction<InstantiatedType, InstantiatedIndexer>
> = Result
function OmitImmediate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema>
  (context: Context, state: State, type: Type, indexer: Indexer, options: TSchemaOptions): 
    TOmitImmediate<Context, State, Type, Indexer> {
  const instantiatedType = InstantiateType(context, state, type)
  const instantiatedIndexer = InstantiateType(context, state, indexer)
  return Memory.Update(OmitAction(instantiatedType, instantiatedIndexer), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TOmitInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema> 
  = TCanInstantiate<Context, [Type, Indexer]> extends true
    ? TOmitImmediate<Context, State, Type, Indexer>
    : TOmitDeferred<Type, Indexer>

export function OmitInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Indexer extends TSchema>
  (context: Context, state: State, type: Type, indexer: Indexer, options: TSchemaOptions): 
    TOmitInstantiate<Context, State, Type, Indexer> {
  return (
    CanInstantiate(context, [type, indexer])
      ? OmitImmediate(context, state, type, indexer, options)
      : OmitDeferred(type, indexer, options)
  ) as never
}
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
// deno-lint-ignore-file

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TRecordDeferred, RecordDeferred } from '../../types/record.ts'
import { type TFromKey, FromKey } from './from-key.ts'

import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'

// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TRecordImmediate<Context extends TProperties, State extends TState, Key extends TSchema, Value extends TSchema,
  InstantatedKey extends TSchema = TInstantiateType<Context, State, Key>,
  InstantiatedValue extends TSchema = TInstantiateType<Context, State, Value>,
  Result extends TSchema = TFromKey<InstantatedKey, InstantiatedValue>
> = Result

function RecordImmediate<Context extends TProperties, State extends TState, Key extends TSchema, Value extends TSchema>
  (context: Context, state: State, key: Key, value: Value, options: TSchemaOptions): 
    TRecordImmediate<Context, State, Key, Value> {
  const instanstiatedKey = InstantiateType(context, state, key)
  const instantiatedValue = InstantiateType(context, state, value)
  return Memory.Update(FromKey(instanstiatedKey, instantiatedValue), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TRecordInstantiate<Context extends TProperties, State extends TState, Key extends TSchema, Value extends TSchema> 
  = TCanInstantiate<Context, [Key]> extends true
    ? TRecordImmediate<Context, State, Key, Value>
    : TRecordDeferred<Key, Value>

export function RecordInstantiate<Context extends TProperties, State extends TState, Key extends TSchema, Value extends TSchema>
  (context: Context, state: State, key: Key, value: Value, options: TSchemaOptions): 
    TRecordInstantiate<Context, State, Key, Value> {
  return (
    CanInstantiate(context, [key])
      ? RecordImmediate(context, state, key, value, options)
      : RecordDeferred(key, value, options)
  ) as never
}
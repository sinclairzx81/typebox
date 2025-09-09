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
import { type TLiteral, IsLiteralNumber, IsLiteralString } from '../../types/literal.ts'
import { type TObject, Object } from '../../types/object.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TIdentifier } from '../../types/identifier.ts'
import { type TMappedKeys, MappedKeys } from './mapped-keys.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template-literal.ts'
import { type TMappedDeferred, MappedDeferred } from '../../action/mapped.ts'
import { type TTemplateLiteralDecode, TemplateLiteralDecode } from '../template-literal/decode.ts'

import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'

// ------------------------------------------------------------------
// InstantiateKeyAs
// ------------------------------------------------------------------
type TInstantiateKeyAs<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema,
  ContextWithKey extends TProperties = Memory.TAssign<Context, { [_ in Identifier['name']]: Key }>,
  InstantiatedKeyAs extends TSchema = TInstantiateType<ContextWithKey, State, As>,
  Result extends TSchema = InstantiatedKeyAs extends TTemplateLiteral<infer Pattern extends string> ? TTemplateLiteralDecode<Pattern> : InstantiatedKeyAs
> = Result

function InstantiateKeyAs<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema>
  (context: Context, state: State, identifier: Identifier, key: Key, as: As): 
    TInstantiateKeyAs<Context, State, Identifier, Key, As> {
  const contextWithKey = Memory.Assign(context, { [identifier['name']]: key })
  const instantiatedKeyAs = InstantiateType(contextWithKey, state, as)
  const result = IsTemplateLiteral(instantiatedKeyAs) ? TemplateLiteralDecode(instantiatedKeyAs.pattern): instantiatedKeyAs
  return result as never
}
// ------------------------------------------------------------------
// InstantiateProperty
// ------------------------------------------------------------------
type TInstantiateProperty<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, Property extends TSchema,
  ContextWithKey extends TProperties = Memory.TAssign<Context, { [_ in Identifier['name']]: Key }>,
  InstantiatedProperty extends TSchema = TInstantiateType<ContextWithKey, State, Property>
> = InstantiatedProperty

function InstantiateProperty<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, key: Key, property: Property): 
    TInstantiateProperty<Context, State, Identifier, Key, Property> {
  const contextWithKey = Memory.Assign(context, { [identifier['name']]: key })
  const instantiatedProperty = InstantiateType(contextWithKey, state, property)
  return instantiatedProperty as never
}
// ------------------------------------------------------------------
// MappedProperty
// ------------------------------------------------------------------
type TMappedProperty<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema, Property extends TSchema,
  InstantiatedProperty extends TSchema = TInstantiateProperty<Context, State, Identifier, Key, Property>,
  InstantiatedKeyAs extends TSchema = TInstantiateKeyAs<Context, State, Identifier, Key, As>,
  Result extends TProperties = (
    InstantiatedKeyAs extends TLiteral<string | number> 
      ? { [_ in InstantiatedKeyAs['const']]: InstantiatedProperty }
      : {}
  )
> = Result
function MappedProperty<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, key: Key, as: As, property: Property): 
    TMappedProperty<Context, State, Identifier, Key, As, Property> {
  const instantiatedProperty = InstantiateProperty(context, state, identifier, key, property) as TSchema
  const instantiatedKeyAs = InstantiateKeyAs(context, state, identifier, key, as) as TSchema
  return (
     IsLiteralString(instantiatedKeyAs) || IsLiteralNumber(instantiatedKeyAs) 
      ? { [instantiatedKeyAs.const]: instantiatedProperty }
      : {}
  ) as never
}
// ------------------------------------------------------------------
// MappedProperties
// ------------------------------------------------------------------
type TMappedProperties<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Keys extends TSchema[], As extends TSchema, Type extends TSchema, Result extends TProperties = {}> = (
  Keys extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TMappedProperties<Context, State, Identifier, Right, As, Type, Result & TMappedProperty<Context, State, Identifier, Left, As, Type>>
    : Result
)
function MappedProperties<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Keys extends TSchema[], As extends TSchema, Type extends TSchema>
  (context: Context, state: State, identifier: Identifier, keys: [...Keys], as: As, type: Type): 
    TMappedProperties<Context, State, Identifier, Keys, As, Type> {
  return keys.reduce((result, left) => {
    return { ...result, ...MappedProperty(context, state, identifier, left, as, type) }
  }, {} as TProperties) as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
type TMappedAction<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema, Property extends TSchema,
  Keys extends TSchema[] = TMappedKeys<Key>,
  Mapped extends TProperties = TMappedProperties<Context, State, Identifier, Keys, As, Property>,
  Result extends TSchema = TObject<{[Key in keyof Mapped]: Mapped[Key]}>
> = Result

function MappedAction<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, key: Key, as: As, type: Property): 
    TMappedAction<Context, State, Identifier, Key, As, Property> {
  const keys = MappedKeys(key) as TSchema[]
  const mapped = MappedProperties(context, state, identifier, keys, as, type)
  const result = Object(mapped)
  return result as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TMappedImmediate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema, Property extends TSchema,
  InstantiatedKey extends TSchema = TInstantiateType<Context, State, Key>,
> = TMappedAction<Context, State, Identifier, InstantiatedKey, As, Property>

function MappedImmediate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, key: Key, as: As, property: Property, options: TSchemaOptions): 
    TMappedImmediate<Context, State, Identifier, Key, As, Property> {
  const instantiatedKey = InstantiateType(context, state, key)
  return Memory.Update(MappedAction(context, state, identifier, instantiatedKey, as, property), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TMappedInstantiate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema, Property extends TSchema> 
  = TCanInstantiate<Context, [Key]> extends true
    ? TMappedImmediate<Context, State, Identifier, Key, As, Property>
    : TMappedDeferred<Identifier, Key, As, Property>

export function MappedInstantiate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Key extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, key: Key, as: As, property: Property, options: TSchemaOptions): 
    TMappedInstantiate<Context, State,Identifier, Key, As, Property> {
  return (
    CanInstantiate(context, [key])
      ? MappedImmediate(context, state, identifier, key, as, property, options)
      : MappedDeferred(identifier, key, as, property, options)
  ) as never
}
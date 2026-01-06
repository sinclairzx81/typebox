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
import { type TProperties } from '../../types/properties.ts'
import { type TMappingType } from './mapping.ts'
import { type TFromType, FromType } from './from-type.ts'
import { type TState, type TInstantiateType, InstantiateType, type TCanInstantiate, CanInstantiate } from '../instantiate.ts'

import { type TCapitalizeDeferred, CapitalizeDeferred } from '../../action/capitalize.ts'
import { type TLowercaseDeferred, LowercaseDeferred } from '../../action/lowercase.ts'
import { type TUncapitalizeDeferred, UncapitalizeDeferred } from '../../action/uncapitalize.ts'
import { type TUppercaseDeferred, UppercaseDeferred } from '../../action/uppercase.ts'

// ------------------------------------------------------------------
// Mappings
// ------------------------------------------------------------------
interface TCapitalizeMapping extends TMappingType { output: Capitalize<this['input']> }
interface TLowercaseMapping extends TMappingType { output: Lowercase<this['input']> }
interface TUncapitalizeMapping extends TMappingType { output: Uncapitalize<this['input']> }
interface TUppercaseMapping extends TMappingType { output: Uppercase<this['input']> }

const CapitalizeMapping = (input: string) => input[0].toUpperCase() + input.slice(1)
const LowercaseMapping = (input: string) => input.toLowerCase()
const UncapitalizeMapping = (input: string) => input[0].toLowerCase() + input.slice(1)
const UppercaseMapping = (input: string) => input.toUpperCase()

// ------------------------------------------------------------------
// Capitalize
// ------------------------------------------------------------------
type TCapitalizeImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TFromType<TCapitalizeMapping, InstantiatedType>
function CapitalizeImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions):
    TCapitalizeImmediate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(FromType(CapitalizeMapping, instantiatedType), {}, options) as never
}
export type TCapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> 
  = TCanInstantiate<Context, [Type]> extends true
    ? TCapitalizeImmediate<Context, State, Type>
    : TCapitalizeDeferred<Type>
export function CapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TCapitalizeInstantiate<Context, State, Type> {
  return (
    CanInstantiate(context, [type])
      ? CapitalizeImmediate(context, state, type, options)
      : CapitalizeDeferred(type, options)
  ) as never
}
// ------------------------------------------------------------------
// Lowercase
// ------------------------------------------------------------------
type TLowercaseImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TFromType<TLowercaseMapping, InstantiatedType>
function LowercaseImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions)
    : TLowercaseImmediate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(FromType(LowercaseMapping, instantiatedType), {}, options) as never
}
export type TLowercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> 
  = TCanInstantiate<Context, [Type]> extends true
    ? TLowercaseImmediate<Context, State, Type>
    : TLowercaseDeferred<Type>
export function LowercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TLowercaseInstantiate<Context, State, Type> {
  return (
    CanInstantiate(context, [type])
      ? LowercaseImmediate(context, state, type, options) as never
      : LowercaseDeferred(type, options)
  ) as never
}
// ------------------------------------------------------------------
// Uncapitalize
// ------------------------------------------------------------------
type TUncapitalizeImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TFromType<TUncapitalizeMapping, InstantiatedType>
function UncapitalizeImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions) {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(FromType(UncapitalizeMapping, instantiatedType), {}, options) as never
}
export type TUncapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> 
  = TCanInstantiate<Context, [Type]> extends true
    ? TUncapitalizeImmediate<Context, State, Type>
    : TUncapitalizeDeferred<Type>
export function UncapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TUncapitalizeInstantiate<Context, State, Type> {
  return (
    CanInstantiate(context, [type])
      ? UncapitalizeImmediate(context, state, type, options)
      : UncapitalizeDeferred(type, options)
  ) as never
}
// ------------------------------------------------------------------
// Uppercase
// ------------------------------------------------------------------
type TUppercaseImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TFromType<TUppercaseMapping, InstantiatedType>
function UppercaseImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions):
    TUppercaseImmediate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(FromType(UppercaseMapping, instantiatedType), {}, options) as never
}
export type TUppercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> 
  = TCanInstantiate<Context, [Type]> extends true
    ? TUppercaseImmediate<Context, State, Type>
    : TUppercaseDeferred<Type>

export function UppercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TUppercaseInstantiate<Context, State, Type> {
  return (
    CanInstantiate(context, [type])
      ? UppercaseImmediate(context, state, type, options)
      : UppercaseDeferred(type, options)
  ) as never
}
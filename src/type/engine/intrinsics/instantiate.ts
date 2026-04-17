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
// Mapping
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
// Action
// ------------------------------------------------------------------
export type TCapitalizeAction<Type extends TSchema,
  Result extends TSchema = TCanInstantiate<[Type]> extends true
    ? TFromType<TCapitalizeMapping, Type>
    : TCapitalizeDeferred<Type>
> = Result
export function CapitalizeAction<Type extends TSchema>
  (type: Type, options: TSchemaOptions):
  TCapitalizeAction<Type> {
  const result = CanInstantiate([type])
    ? Memory.Update(FromType(CapitalizeMapping, type), {}, options)
    : CapitalizeDeferred(type, options)
  return result as never
}

export type TLowercaseAction<Type extends TSchema,
  Result extends TSchema = TCanInstantiate<[Type]> extends true
    ? TFromType<TLowercaseMapping, Type>
    : TLowercaseDeferred<Type>
> = Result
export function LowercaseAction<Type extends TSchema>
  (type: Type, options: TSchemaOptions):
  TLowercaseAction<Type> {
  const result = CanInstantiate([type])
    ? Memory.Update(FromType(LowercaseMapping, type), {}, options)
    : LowercaseDeferred(type, options)
  return result as never
}

export type TUncapitalizeAction<Type extends TSchema,
  Result extends TSchema = TCanInstantiate<[Type]> extends true
    ? TFromType<TUncapitalizeMapping, Type>
    : TUncapitalizeDeferred<Type>
> = Result
export function UncapitalizeAction<Type extends TSchema>
  (type: Type, options: TSchemaOptions):
  TUncapitalizeAction<Type> {
  const result = CanInstantiate([type])
    ? Memory.Update(FromType(UncapitalizeMapping, type), {}, options)
    : UncapitalizeDeferred(type, options)
  return result as never
}

export type TUppercaseAction<Type extends TSchema,
  Result extends TSchema = TCanInstantiate<[Type]> extends true
    ? TFromType<TUppercaseMapping, Type>
    : TUppercaseDeferred<Type>
> = Result
export function UppercaseAction<Type extends TSchema>
  (type: Type, options: TSchemaOptions):
  TUppercaseAction<Type> {
  const result = CanInstantiate([type])
    ? Memory.Update(FromType(UppercaseMapping, type), {}, options)
    : UppercaseDeferred(type, options)
  return result as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TCapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TCapitalizeAction<InstantiatedType>
export function CapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions):
    TCapitalizeInstantiate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return CapitalizeAction(instantiatedType, options)
}

export type TLowercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TLowercaseAction<InstantiatedType>
export function LowercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions):
    TLowercaseInstantiate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return LowercaseAction(instantiatedType, options)
}

export type TUncapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TUncapitalizeAction<InstantiatedType>
export function UncapitalizeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions):
    TUncapitalizeInstantiate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return UncapitalizeAction(instantiatedType, options)
}

export type TUppercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TUppercaseAction<InstantiatedType>
export function UppercaseInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions):
    TUppercaseInstantiate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return UppercaseAction(instantiatedType, options)
}

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

import { type TUnreachable, Unreachable } from '../../system/unreachable/index.ts'
import { Memory } from '../../system/memory/index.ts'
import { Guard } from '../../guard/index.ts'

// ----------------------------------------------------------------------------
// Schematics
// ----------------------------------------------------------------------------
import { type TSchema, IsSchema } from '../types/schema.ts'
import { type TArray, IsArray } from '../types/array.ts'
import { type TUnknown, IsUnknown } from '../types/unknown.ts'
import { type TProperties } from '../types/properties.ts'
import { type TTuple, Tuple } from '../types/tuple.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'
import { type TUnion, Union } from '../types/union.ts'

// ----------------------------------------------------------------------------
// Operator
// ----------------------------------------------------------------------------
import { type TInfer, IsInfer } from '../types/infer.ts'
import { type TRest, IsRest } from '../types/rest.ts'
import * as Result from './result.ts'

// ----------------------------------------------------------------------------
// Inferrable
// ----------------------------------------------------------------------------
export interface TInferable<Name extends string = string, Type extends TSchema = TSchema> {
  '~kind': 'Inferrable'
  name: Name
  type: Type
}
// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------
export function Inferrable<Name extends string, Type extends TSchema = TSchema>(name: Name, type: Type) {
  return Memory.Create({ '~kind': 'Inferrable' }, { name, type }, {}) as never
}
// ----------------------------------------------------------------------------
// Guard
// ----------------------------------------------------------------------------
export function IsInferable(value: unknown): value is TInferable {
  return Guard.IsObject(value)
    && Guard.HasPropertyKey(value, '~kind')
    && Guard.HasPropertyKey(value, 'name')
    && Guard.HasPropertyKey(value, 'type')
    && Guard.IsEqual(value["~kind"], 'Inferrable')
    && Guard.IsString(value.name)
    && Guard.IsObject(value.type)
}
// ----------------------------------------------------------------------------
// TryRestInferable
//
// - TRest<TInfer<Name, TArray<TSchema>>> 
// - TRest<TInfer<Name, TUnknown>>
//
// ----------------------------------------------------------------------------
//
// deno-coverage-ignore-start - symmetric unreachable
//
// The outer 'undefined' return arm is considered unreachable via Extends calls.  
// As this function is only used by the Tuple Infer resolver, it may be possible 
// to remove this arm by constraining Type to TRest<TInfer<Name, ...>> 
// 
// (revise-implementation)
//
// ----------------------------------------------------------------------------
export type TTryRestInferable<Type extends TSchema,
  Result extends TInferable | undefined = (
    Type extends TRest<infer RestType extends TSchema>
    ? RestType extends TInfer<infer Name extends string, infer Type extends TSchema>
      ? Type extends TArray<infer Type extends TSchema> ? TInferable<Name, Type> :
        Type extends TUnknown ? TInferable<Name, Type> :
        undefined
      : TUnreachable // undefined
    : undefined
  )
> = Result
export function TryRestInferable<Type extends TSchema>(type: Type): TTryRestInferable<Type> {
  return (
    IsRest(type)
      ? IsInfer(type.items)
        ? IsArray(type.items.extends) ?  Inferrable(type.items.name, type.items.extends.items) :
          IsUnknown(type.items.extends) ? Inferrable(type.items.name, type.items.extends) :
          undefined
        : Unreachable() // undefined
      : undefined
  ) as never
}
// deno-coverage-ignore-stop
// ----------------------------------------------------------------------------
// TryInferable
//
// - Type.TInfer<"K", Type.TNumber>
// ----------------------------------------------------------------------------
export type TTryInferable<Type extends TSchema,
  Result extends TInferable | undefined = (
    Type extends TInfer<infer Name extends string, infer Type extends TSchema> ? TInferable<Name, Type>: 
    undefined
  )
> = Result
export function TryInferable<Type extends TSchema>(type: Type): TTryInferable<Type> {
  return (
    IsInfer(type) ? Inferrable(type.name, type.extends) : 
    undefined
  ) as never
}
// ----------------------------------------------------------------------------
// TryInferResults
// ----------------------------------------------------------------------------
type TryInferResults<Rest extends TSchema[], Right extends TSchema, Result extends TSchema[] = []> = (
  Rest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TExtendsLeft<{}, Head, Right> extends Result.TExtendsTrueLike<TProperties>
      ? TryInferResults<Tail, Right, [...Result, Head]>
      : undefined
    : Result
)
function TryInferResults<Rest extends TSchema[], Right extends TSchema>(rest: [...Rest], right: Right, result: TSchema[] = []): TryInferResults<Rest, Right> {
  const [head, ...tail] = rest
  return (
    IsSchema(head)
    ? (() => {
      const check = ExtendsLeft({}, head, right) 
      return Result.IsExtendsTrueLike(check)
        ? TryInferResults(tail, right, [...result, head])
        : undefined
    })() : result
  ) as never
}
// ----------------------------------------------------------------------------
// InferAsTuple
// ----------------------------------------------------------------------------
export type TInferTupleResult<Inferred extends TProperties, Name extends string, Left extends TSchema[], Right extends TSchema,
  Results extends TSchema[] | undefined = TryInferResults<Left, Right>
> = (
  Results extends [...infer Results extends TSchema[]]
    ? Result.TExtendsTrue<Memory.TAssign<Inferred, { [_ in Name]: TTuple<Results> }>>
    : Result.TExtendsFalse
)
export function InferTupleResult<Inferred extends TProperties, Name extends string, Left extends TSchema[], Right extends TSchema>(inferred: Inferred, name: Name, left: Left, right: Right): TInferTupleResult<Inferred, Name, Left, Right> {
  const results = TryInferResults(left, right)
  return (
    Guard.IsArray(results)
    ? Result.ExtendsTrue(Memory.Assign(inferred, { [name]: Tuple(results) }))
    : Result.ExtendsFalse()
  ) as never
}
// ----------------------------------------------------------------------------
// InferAsUnion
// ----------------------------------------------------------------------------
export type TInferUnionResult<Inferred extends TProperties, Name extends string, Left extends TSchema[], Right extends TSchema,
  Results extends TSchema[] | undefined = TryInferResults<Left, Right>
> = (
  Results extends [...infer Results extends TSchema[]]
    ? Result.TExtendsTrue<Memory.TAssign<Inferred, { [_ in Name]: TUnion<Results> }>>
    : Result.TExtendsFalse
)
export function InferUnionResult<Inferred extends TProperties, Name extends string, Left extends TSchema[], Right extends TSchema>(inferred: Inferred, name: Name, left: Left, right: Right): TInferUnionResult<Inferred, Name, Left, Right> {
  const results = TryInferResults(left, right)
  return (
    Guard.IsArray(results)
      ? Result.ExtendsTrue(Memory.Assign(inferred, { [name]: Union(results) }))
      : Result.ExtendsFalse()
  ) as never
}
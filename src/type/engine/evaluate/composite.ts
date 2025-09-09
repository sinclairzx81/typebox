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
// deno-lint-ignore-file

import { type TUnreachable, Unreachable } from '../../../system/unreachable/index.ts'
import { Guard } from '../../../guard/index.ts'

import { type TReadonly, type TReadonlyAdd, type TReadonlyRemove, ReadonlyAdd, ReadonlyRemove, IsReadonly } from '../../types/_readonly.ts'
import { type TOptional, type TOptionalAdd, type TOptionalRemove, OptionalAdd, OptionalRemove, IsOptional } from '../../types/_optional.ts'

import { type TSchema } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TObject, Object, IsObject } from '../../types/object.ts'
import { type TNever, Never } from '../../types/never.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'

import { type TTupleElementsToProperties, TupleElementsToProperties } from '../tuple/to-object.ts'
import { type TEvaluateIntersect, EvaluateIntersect } from './evaluate.ts'

// ----------------------------------------------------------------------------
// GuardReadonlyProperty
// ----------------------------------------------------------------------------
type TIsReadonlyProperty<Left extends TSchema, Right extends TSchema> = (
  Left extends TReadonly<Left> ? Right extends TReadonly<Right> ? true : false : false
)
function IsReadonlyProperty<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TIsReadonlyProperty<Left, Right> {
  return (IsReadonly(left) ? IsReadonly(right) ? true : false : false) as never
}
// ----------------------------------------------------------------------------
// GuardOptionalProperty
// ----------------------------------------------------------------------------
type TIsOptionalProperty<Left extends TSchema, Right extends TSchema> = (
  Left extends TOptional<Left> ? Right extends TOptional<Right> ? true : false : false
)
function IsOptionalProperty<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TIsOptionalProperty<Left, Right> {
  return (IsOptional(left) ? IsOptional(right) ? true : false : false) as never
}
// ----------------------------------------------------------------------------
// CompositeProperty
// ----------------------------------------------------------------------------
type TCompositeProperty<Left extends TSchema, Right extends TSchema,
  IsReadonly extends boolean = TIsReadonlyProperty<Left, Right>,
  IsOptional extends boolean = TIsOptionalProperty<Left, Right>,
  Evaluated extends TSchema = TEvaluateIntersect<[Left, Right]>,
  // Modifiers need to be discarded and re-applied
  Property extends TSchema = TReadonlyRemove<TOptionalRemove<Evaluated>>
> = (
  [IsReadonly, IsOptional] extends [true, true] ? TReadonlyAdd<TOptionalAdd<Property>> :
  [IsReadonly, IsOptional] extends [true, false] ? TReadonlyAdd<Property> :
  [IsReadonly, IsOptional] extends [false, true] ? TOptionalAdd<Property> :
  Property
)
function CompositeProperty<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TCompositeProperty<Left, Right> {
  const isReadonly = IsReadonlyProperty(left, right)
  const isOptional = IsOptionalProperty(left, right)
  const evaluated = EvaluateIntersect([left, right]) as TSchema
  // Modifiers need to be discarded and re-applied
  const property = ReadonlyRemove(OptionalRemove(evaluated))
  return (
    isReadonly && isOptional ? ReadonlyAdd(OptionalAdd(property)) :
    isReadonly && !isOptional ? ReadonlyAdd(property) :
    !isReadonly && isOptional ? OptionalAdd(property) :
    property
  ) as never
}
// ----------------------------------------------------------------------------
// CompositePropertyKey
//
// deno-coverage-ignore-start - symmetric unreachable
//
// CompositePropertyKey is assured a Key in Left or Right, but we retain 
// checks on fall-through to remain symmetric with the type.
//
// ----------------------------------------------------------------------------
type TCompositePropertyKey<Left extends TProperties, Right extends TProperties, Key extends PropertyKey,
  Result extends TSchema = (
    Key extends keyof Left 
      ? Key extends keyof Right
        ? TCompositeProperty<Left[Key], Right[Key]>
        : Left[Key]
      : Key extends keyof Right
        ? Right[Key]
        : TNever
  )
> = Result
function CompositePropertyKey<Left extends TProperties, Right extends TProperties, Key extends PropertyKey>(left: Left, right: Right, key: Key): TCompositePropertyKey<Left, Right, Key> {
  return (
    key in left
      ? key in right
        ? CompositeProperty(left[key], right[key])
        : left[key]
      : key in right 
        ? right[key]
        : Never()
  ) as never
}
// deno-coverage-ignore-stop
// ----------------------------------------------------------------------------
// CompositeProperties
// ----------------------------------------------------------------------------
type TCompositeProperties<Left extends TProperties, Right extends TProperties,
  Result extends TProperties = {
    [Key in keyof (Right & Left)]: TCompositePropertyKey<Left, Right, Key>
  }
> = Result
function CompositeProperties<Left extends TProperties, Right extends TProperties>(left: Left, right: Right): TCompositeProperties<Left, Right> {
  const keys = new Set([ ...Guard.Keys(right), ...Guard.Keys(left)])
  return [...keys].reduce((result, key) => {
    return { ...result, [key]: CompositePropertyKey(left, right, key) }
  }, {}) as never
}
// ----------------------------------------------------------------------------
// GetProperties
// ----------------------------------------------------------------------------
type TGetProperties<Type extends TSchema,
  Result extends TProperties = (
    Type extends TObject<infer Properties extends TProperties> ? Properties :
    Type extends TTuple<infer Types extends TSchema[]> ? TTupleElementsToProperties<Types> :
    TUnreachable // {} 
  )
> = Result
// ------------------------------------------------------------------
// deno-coverage-ignore-start - symmetric unreachable | internal
//
// Composite is called by Distribute which provisions the type as
// either TObject ot TTuple. Fall-through unreachable.
//
// ------------------------------------------------------------------
function GetProperties<Type extends TSchema>(type: Type): TGetProperties<Type> {
  const result = (
    IsObject(type) ? type.properties :
    IsTuple(type) ? TupleElementsToProperties(type.items) :
    Unreachable() // {}
  ) as never
  return result as never
}
// deno-coverage-ignore-stop
// ----------------------------------------------------------------------------
// Composite
// ----------------------------------------------------------------------------
export type TComposite<Left extends TSchema, Right extends TSchema,
  LeftProperties extends TProperties = TGetProperties<Left>,
  RightProperties extends TProperties = TGetProperties<Right>,
  Properties extends TProperties = TCompositeProperties<LeftProperties, RightProperties>,
  Result extends TSchema = TObject<Properties>
> = Result
export function Composite<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TComposite<Left, Right> {
  const leftProperties = GetProperties(left) as TProperties
  const rightProperties = GetProperties(right) as TProperties
  const properties = CompositeProperties(leftProperties, rightProperties)
  return Object(properties) as never
}
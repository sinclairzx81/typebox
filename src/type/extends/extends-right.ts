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

import { Memory } from '../../system/memory/index.ts'
import { type TSchema, IsSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TAny, IsAny } from '../types/any.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../types/enum.ts'
import { type TInfer, IsInfer } from '../types/infer.ts'
import { type TIntersect, IsIntersect } from '../types/intersect.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../types/template-literal.ts'
import { type TUnion, IsUnion } from '../types/union.ts'
import { type TUnknown, IsUnknown } from '../types/unknown.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'

import * as Result from './result.ts'

import { type TTemplateLiteralDecode, TemplateLiteralDecode } from '../engine/template-literal/decode.ts'
import { type TEnumValuesToUnion, EnumValuesToUnion } from '../engine/enum/index.ts'

// ----------------------------------------------------------------------------
// ExtendsRightInfer
//
// We support something TypeScript doesn't seem to with RightInfer, that is the
// interior inference of S when embedded in a exterior infer context.
//
// { x: 1 } extends infer T extends { x: infer S } ? [T, S] : false
//                        ^                    ^
//                    (exterior)           (interior)
//
// ----------------------------------------------------------------------------
type TExtendsRightInfer<Inferred extends TProperties, Name extends string, Left extends TSchema, Right extends TSchema,
  Result extends Result.TResult = (
    TExtendsLeft<Inferred, Left, Right> extends Result.TExtendsTrueLike<infer CheckInferred extends TProperties>
      ? Result.TExtendsTrue<Memory.TAssign<Memory.TAssign<Inferred, CheckInferred>, { [_ in Name]: Left }>>
      : Result.TExtendsFalse
  )
> = Result
function ExtendsRightInfer<Inferred extends TProperties, Name extends string, Left extends TSchema, Right extends TSchema>
  (inferred: Inferred, name: Name, left: Left, right: Right): 
    TExtendsRightInfer<Inferred, Name, Left, Right> {
  const check = ExtendsLeft(inferred, left, right)
  return (
    Result.IsExtendsTrueLike(check)
      ? Result.ExtendsTrue(Memory.Assign(Memory.Assign(inferred, check.inferred), { [name]: left }))
      : Result.ExtendsFalse()
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsRightAny
// ----------------------------------------------------------------------------
type TExtendsRightAny<Inferred extends TProperties, Left extends TSchema,
  Result extends Result.TResult = Result.TExtendsTrue<Inferred>
> = Result
function ExtendsRightAny<Inferred extends TProperties, Left extends TSchema>
  (inferred: Inferred, left: Left): 
    TExtendsRightAny<Inferred, Left> {
  return Result.ExtendsTrue(inferred)
}
// ----------------------------------------------------------------------------
// ExtendsRightEnum
// ----------------------------------------------------------------------------
type TExtendsRightEnum<Inferred extends TProperties, Left extends TSchema, Right extends TEnumValue[],
  Union extends TSchema = TEnumValuesToUnion<Right>
> = TExtendsLeft<Inferred, Left, Union>
function ExtendsRightEnum<Inferred extends TProperties, Left extends TSchema, Right extends TEnumValue[]>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsRightEnum<Inferred, Left, Right> {
  const union = EnumValuesToUnion(right)
  return ExtendsLeft(inferred, left, union) as never
}
// ----------------------------------------------------------------------------
// ExtendsRightIntersect
// ----------------------------------------------------------------------------
type TExtendsRightIntersect<Inferred extends TProperties, Left extends TSchema, Right extends TSchema[]> = (
  Right extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
  ? TExtendsLeft<Inferred, Left, Head> extends Result.TExtendsTrueLike<infer Inferred extends TProperties> 
    ? TExtendsRightIntersect<Inferred, Left, Tail>
    : Result.TExtendsFalse
  : Result.TExtendsTrue<Inferred>
)
function ExtendsRightIntersect<Inferred extends TProperties, Left extends TSchema, Right extends TSchema[]>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsRightIntersect<Inferred, Left, Right> {
  const [head, ...tail] = right
  return (
    IsSchema(head) ? (() => {
      const check = ExtendsLeft(inferred, left, head)
      return Result.IsExtendsTrueLike(check)
        ? ExtendsRightIntersect(check.inferred, left, tail)
        : Result.ExtendsFalse()
    })() : Result.ExtendsTrue(inferred)
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsRightTemplateLiteral
// ----------------------------------------------------------------------------
type TExtendsRightTemplateLiteral<Inferred extends TProperties, Left extends TSchema, Right extends string,
  Decoded extends TSchema = TTemplateLiteralDecode<Right>
> = TExtendsLeft<Inferred, Left, Decoded>
function ExtendsRightTemplateLiteral<Inferred extends TProperties, Left extends TSchema, Right extends string>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsRightTemplateLiteral<Inferred, Left, Right> {
  const decoded = TemplateLiteralDecode(right)
  return ExtendsLeft(inferred, left, decoded) as never
}
// ----------------------------------------------------------------------------
// ExtendsRightUnion
// ----------------------------------------------------------------------------
type TExtendsRightUnion<Inferred extends TProperties, Left extends TSchema, Right extends TSchema[]> = (
  Right extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TExtendsLeft<Inferred, Left, Head> extends Result.TExtendsTrueLike<infer Inferred extends TProperties> 
      ? Result.TExtendsTrue<Inferred>
      : TExtendsRightUnion<Inferred, Left, Tail>
    : Result.TExtendsFalse
)
function ExtendsRightUnion<Inferred extends TProperties, Left extends TSchema, Right extends TSchema[]>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsRightUnion<Inferred, Left, Right> {
  const [head, ...tail] = right
  return (
    IsSchema(head) ? (() => {
      const check = ExtendsLeft(inferred, left, head)
      return Result.IsExtendsTrueLike(check)
        ? Result.ExtendsTrue(check.inferred)
        : ExtendsRightUnion(inferred, left, tail)
    })() : Result.ExtendsFalse()
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsRight
// ----------------------------------------------------------------------------
export type TExtendsRight<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (
  Right extends TAny ? TExtendsRightAny<Inferred, Left> :
  Right extends TEnum<infer Values extends TEnumValue[]> ? TExtendsRightEnum<Inferred, Left, Values> :
  Right extends TInfer<infer Name extends string, infer Type extends TSchema> ? TExtendsRightInfer<Inferred, Name, Left, Type> :
  Right extends TTemplateLiteral<infer Pattern extends string> ? TExtendsRightTemplateLiteral<Inferred, Left, Pattern> :
  Right extends TIntersect<infer Types extends TSchema[]> ? TExtendsRightIntersect<Inferred, Left, Types> :
  Right extends TUnion<infer Types extends TSchema[]> ? TExtendsRightUnion<Inferred, Left, Types> :
  Right extends TUnknown ? Result.TExtendsTrue<Inferred> :
  Result.TExtendsFalse
)
export function ExtendsRight<Inferred extends TProperties, Left extends TSchema, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsRight<Inferred, Left, Right> {
  return (
    IsAny(right) ? ExtendsRightAny(inferred, left) :
    IsEnum(right) ? ExtendsRightEnum(inferred, left, right.enum) :
    IsInfer(right) ? ExtendsRightInfer(inferred, right.name, left, right.extends) :
    IsIntersect(right) ? ExtendsRightIntersect(inferred, left, right.allOf) :
    IsTemplateLiteral(right) ? ExtendsRightTemplateLiteral(inferred, left, right.pattern) :
    IsUnion(right) ? ExtendsRightUnion(inferred, left, right.anyOf) :
    IsUnknown(right) ? Result.ExtendsTrue(inferred) :
    Result.ExtendsFalse()
  ) as never
}

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

import { type TExtendsAny, ExtendsAny } from './any.ts'
import { type TExtendsArray, ExtendsArray } from './array.ts'
import { type TExtendsBigInt, ExtendsBigInt } from './bigint.ts'
import { type TExtendsBoolean, ExtendsBoolean } from './boolean.ts'
import { type TExtendsConstructor, ExtendsConstructor } from './constructor.ts'
import { type TExtendsEnum, ExtendsEnum } from './enum.ts'
import { type TExtendsFunction, ExtendsFunction } from './function.ts'
import { type TExtendsInteger, ExtendsInteger } from './integer.ts'
import { type TExtendsIntersect, ExtendsIntersect } from './intersect.ts'
import { type TExtendsLiteral, ExtendsLiteral } from './literal.ts'
import { type TExtendsNever, ExtendsNever } from './never.ts'
import { type TExtendsNull, ExtendsNull } from './null.ts'
import { type TExtendsNumber, ExtendsNumber } from './number.ts'
import { type TExtendsObject, ExtendsObject } from './object.ts'
import { type TExtendsString, ExtendsString } from './string.ts'
import { type TExtendsSymbol, ExtendsSymbol } from './symbol.ts'
import { type TExtendsTemplateLiteral, ExtendsTemplateLiteral } from './template-literal.ts'
import { type TExtendsTuple, ExtendsTuple  } from './tuple.ts'
import { type TExtendsUndefined, ExtendsUndefined } from './undefined.ts'
import { type TExtendsUnion, ExtendsUnion } from './union.ts'
import { type TExtendsUnknown, ExtendsUnknown } from './unknown.ts'
import { type TExtendsVoid, ExtendsVoid } from './void.ts'

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
import { type TAny, IsAny } from '../types/any.ts'
import { type TArray, IsArray } from '../types/array.ts'
import { type TBigInt, IsBigInt } from '../types/bigint.ts'
import { type TBoolean, IsBoolean  } from '../types/boolean.ts'
import { type TConstructor, IsConstructor } from '../types/constructor.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../types/enum.ts'
import { type TFunction, IsFunction } from '../types/function.ts'
import { type TInteger, IsInteger } from '../types/integer.ts'
import { type TIntersect, IsIntersect } from '../types/intersect.ts'
import { type TLiteral, IsLiteral } from '../types/literal.ts'
import { type TNever, IsNever } from '../types/never.ts'
import { type TNull, IsNull } from '../types/null.ts'
import { type TNumber, IsNumber } from '../types/number.ts'
import { type TObject, IsObject } from '../types/object.ts'
import { type TSchema } from '../types/schema.ts'
import { type TString, IsString } from '../types/string.ts'
import { type TSymbol, IsSymbol } from '../types/symbol.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../types/template-literal.ts'
import { type TTuple, IsTuple } from '../types/tuple.ts'
import { type TUndefined, IsUndefined } from '../types/undefined.ts'
import { type TUnknown, IsUnknown } from '../types/unknown.ts'
import { type TProperties } from '../types/properties.ts'
import { type TUnion, IsUnion } from '../types/union.ts'
import { type TVoid, IsVoid } from '../types/void.ts'

import * as Result from './result.ts'

// ----------------------------------------------------------------------------
// ExtendsLeft
// ----------------------------------------------------------------------------
export type TExtendsLeft<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (
  Left extends TAny ? TExtendsAny<Inferred, Left, Right> :
  Left extends TArray<infer Items extends TSchema> ? TExtendsArray<Inferred, Left, Items, Right> :
  Left extends TBigInt ? TExtendsBigInt<Inferred, Left, Right> :
  Left extends TBoolean ? TExtendsBoolean<Inferred, Left, Right> :
  Left extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TExtendsConstructor<Inferred, Parameters, InstanceType, Right> :
  Left extends TEnum<infer Values extends TEnumValue[]> ? TExtendsEnum<Inferred, TEnum<Values>, Right> :
  Left extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TExtendsFunction<Inferred, Parameters, ReturnType, Right> :
  Left extends TInteger ? TExtendsInteger<Inferred, Left, Right> :
  Left extends TIntersect<infer Types extends TSchema[]> ? TExtendsIntersect<Inferred, Types, Right> :
  Left extends TLiteral ? TExtendsLiteral<Inferred, Left, Right> :
  Left extends TNever ? TExtendsNever<Inferred, Left, Right> :
  Left extends TNull ? TExtendsNull<Inferred, Left, Right> :
  Left extends TNumber ? TExtendsNumber<Inferred, Left, Right> :
  Left extends TObject<infer Properties extends TProperties> ? TExtendsObject<Inferred, Properties, Right> :
  Left extends TString ? TExtendsString<Inferred, Left, Right> :
  Left extends TSymbol ? TExtendsSymbol<Inferred, Left, Right> :
  Left extends TTemplateLiteral<infer Pattern extends string> ? TExtendsTemplateLiteral<Inferred, Pattern, Right> :
  Left extends TTuple<infer Types extends TSchema[]> ? TExtendsTuple<Inferred, Types, Right> :
  Left extends TUndefined ? TExtendsUndefined<Inferred, Left, Right> :
  Left extends TUnion<infer Types extends TSchema[]> ? TExtendsUnion<Inferred, Types, Right> :
  Left extends TUnknown ? TExtendsUnknown<Inferred, Left, Right> :
  Left extends TVoid ? TExtendsVoid<Inferred, Left, Right> :
  Result.TExtendsFalse
)
export function ExtendsLeft<Inferred extends TProperties, Left extends TSchema, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsLeft<Inferred, Left, Right> {
  return (
    IsAny(left) ? ExtendsAny(inferred, left, right) :
    IsArray(left) ? ExtendsArray(inferred, left, left.items, right) :
    IsBigInt(left) ? ExtendsBigInt(inferred, left, right) :
    IsBoolean(left) ? ExtendsBoolean(inferred, left, right) :
    IsConstructor(left) ? ExtendsConstructor(inferred, left.parameters, left.instanceType, right) :
    IsEnum(left) ? ExtendsEnum(inferred, left, right) :
    IsFunction(left) ? ExtendsFunction(inferred, left.parameters, left.returnType, right) :
    IsInteger(left) ? ExtendsInteger(inferred, left, right) :
    IsIntersect(left) ? ExtendsIntersect(inferred, left.allOf, right) :
    IsLiteral(left) ? ExtendsLiteral(inferred, left, right) :
    IsNever(left) ? ExtendsNever(inferred, left, right) :
    IsNull(left) ? ExtendsNull(inferred, left, right) :
    IsNumber(left) ? ExtendsNumber(inferred, left, right) :
    IsObject(left) ? ExtendsObject(inferred, left.properties, right) :
    IsString(left) ? ExtendsString(inferred, left, right) :
    IsSymbol(left) ? ExtendsSymbol(inferred, left, right) :
    IsTemplateLiteral(left) ? ExtendsTemplateLiteral(inferred, left.pattern, right) :
    IsTuple(left) ? ExtendsTuple(inferred, left.items, right) :
    IsUndefined(left) ? ExtendsUndefined(inferred, left, right) :
    IsUnion(left) ? ExtendsUnion(inferred, left.anyOf, right) :
    IsUnknown(left) ? ExtendsUnknown(inferred, left, right) :
    IsVoid(left) ? ExtendsVoid(inferred, left, right) :
    Result.ExtendsFalse()
  ) as never
}
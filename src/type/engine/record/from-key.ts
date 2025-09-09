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

import { type TSchema } from '../../types/schema.ts'
import { type TAny, IsAny } from '../../types/any.ts'
import { type TBoolean, IsBoolean } from '../../types/boolean.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../../types/enum.ts'
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TInteger, IsInteger } from '../../types/integer.ts'
import { type TLiteral, type TLiteralValue, IsLiteral } from '../../types/literal.ts'
import { type TNumber, IsNumber } from '../../types/number.ts'
import { type TObject, Object } from '../../types/object.ts'
import { type TString, IsString } from '../../types/string.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template-literal.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

// ------------------------------------------------------------------
// Keys and Deferred
// ------------------------------------------------------------------
import { type TFromAnyKey, FromAnyKey } from './from-key-any.ts'
import { type TFromBooleanKey, FromBooleanKey } from './from-key-boolean.ts'
import { type TFromEnumKey, FromEnumKey } from './from-key-enum.ts'
import { type TFromIntegerKey, FromIntegerKey } from './from-key-integer.ts'
import { type TFromIntersectKey, FromIntersectKey } from './from-key-intersect.ts'
import { type TFromLiteralKey, FromLiteralKey } from './from-key-literal.ts'
import { type TFromNumberKey, FromNumberKey } from './from-key-number.ts'
import { type TFromStringKey, FromStringKey } from './from-key-string.ts'
import { type TFromTemplateKey, FromTemplateKey } from './from-key-template-literal.ts'
import { type TFromUnionKey, FromUnionKey } from './from-key-union.ts'

// ------------------------------------------------------------------
// RecordImmediate
// ------------------------------------------------------------------
export type TFromKey<Key extends TSchema, Value extends TSchema,
  Result extends TSchema = (
    Key extends TAny ? TFromAnyKey<Value> :
    Key extends TBoolean ? TFromBooleanKey<Value> :
    Key extends TEnum<infer Values extends TEnumValue[]> ? TFromEnumKey<Values, Value> :
    Key extends TInteger ? TFromIntegerKey<Key, Value> :
    Key extends TIntersect<infer Types extends TSchema[]> ? TFromIntersectKey<Types, Value> :
    Key extends TLiteral<infer LiteralValue extends TLiteralValue> ? TFromLiteralKey<LiteralValue, Value> :
    Key extends TNumber ? TFromNumberKey<Key, Value> :
    Key extends TString ? TFromStringKey<Key, Value> :
    Key extends TTemplateLiteral<infer Pattern extends string> ? TFromTemplateKey<Pattern, Value> :
    Key extends TUnion<infer Types extends TSchema[]> ? TFromUnionKey<Types, Value> :
    TObject<{}>
  )
> = Result
export function FromKey<Key extends TSchema, Value extends TSchema>(key: Key, value: Value): TFromKey<Key, Value> {
  const result = (
    IsAny(key) ? FromAnyKey(value) :
    IsBoolean(key) ? FromBooleanKey(value) :
    IsEnum(key) ? FromEnumKey(key.enum, value) :
    IsInteger(key) ? FromIntegerKey(key, value) :
    IsIntersect(key) ? FromIntersectKey(key.allOf, value) :
    IsLiteral(key) ? FromLiteralKey(key.const, value) :
    IsNumber(key) ? FromNumberKey(key, value) :
    IsUnion(key) ? FromUnionKey(key.anyOf, value) :
    IsString(key) ? FromStringKey(key, value) :
    IsTemplateLiteral(key) ? FromTemplateKey(key.pattern, value) :
    Object({})
  )
  return result as never
}

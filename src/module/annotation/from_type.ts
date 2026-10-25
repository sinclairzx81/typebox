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

import * as Type from '../../type/index.ts'

import { FromAny } from './from_any.ts'
import { FromArray } from './from_array.ts'
import { FromBigInt } from './from_bigint.ts'
import { FromBoolean } from './from_boolean.ts'
import { FromConstructor } from './from_constructor.ts'
import { FromCyclic } from './from_cyclic.ts'
import { FromEnum } from './from_enum.ts'
import { FromFunction } from './from_function.ts'
import { FromInteger } from './from_integer.ts'
import { FromIntersect } from './from_intersect.ts'
import { FromLiteral } from './from_literal.ts'
import { FromNever } from './from_never.ts'
import { FromNull } from './from_null.ts'
import { FromNumber } from './from_number.ts'
import { FromObject } from './from_object.ts'
import { FromRecord } from './from_record.ts'
import { FromRef } from './from_ref.ts'
import { FromString } from './from_string.ts'
import { FromSymbol } from './from_symbol.ts'
import { FromTemplateLiteral } from './from_template_literal.ts'
import { FromThis } from './from_this.ts'
import { FromTuple } from './from_tuple.ts'
import { FromUndefined } from './from_undefined.ts'
import { FromUnion } from './from_union.ts'
import { FromUnknown } from './from_unknown.ts'
import { FromVoid } from './from_void.ts'

export function FromType(context: Type.TProperties, type: Type.TSchema): string {
  return (
    Type.IsAny(type) ? FromAny(context, type) :
    Type.IsArray(type) ? FromArray(context, type) :
    Type.IsBigInt(type) ? FromBigInt(context, type) :
    Type.IsBoolean(type) ? FromBoolean(context, type) :
    Type.IsConstructor(type) ? FromConstructor(context, type) :
    Type.IsCyclic(type) ? FromCyclic(context, type) :
    Type.IsEnum(type) ? FromEnum(context, type) :
    Type.IsFunction(type) ? FromFunction(context, type) :
    Type.IsInteger(type) ? FromInteger(context, type) :
    Type.IsIntersect(type) ? FromIntersect(context, type) :
    Type.IsLiteral(type) ? FromLiteral(context, type) :
    Type.IsNever(type) ? FromNever(context, type) :
    Type.IsNull(type) ? FromNull(context, type) :
    Type.IsNumber(type) ? FromNumber(context, type) :
    Type.IsObject(type) ? FromObject(context, type) :
    Type.IsRecord(type) ? FromRecord(context, type) :
    Type.IsRef(type) ? FromRef(context, type) :
    Type.IsString(type) ? FromString(context, type) :
    Type.IsSymbol(type) ? FromSymbol(context, type) :
    Type.IsTemplateLiteral(type) ? FromTemplateLiteral(context, type) :
    Type.IsThis(type) ? FromThis(context, type) :
    Type.IsTuple(type) ? FromTuple(context, type) :
    Type.IsUndefined(type) ? FromUndefined(context, type) :
    Type.IsUnion(type) ? FromUnion(context, type) :
    Type.IsUnknown(type) ? FromUnknown(context, type) :
    Type.IsVoid(type) ? FromVoid(context, type) :
    'unknown'
  )
}

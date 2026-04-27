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

import * as T from '../../type/index.ts'
import * as S from '../../schema/types/index.ts'

import { FromDefault } from './from_default.ts'

import { FromArray } from './from_array.ts'
import { FromAsyncIterator } from './from_async_iterator.ts'
import { FromBase } from './from_base.ts'
import { FromBigInt } from './from_bigint.ts'
import { FromBoolean } from './from_boolean.ts'
import { FromConstructor } from './from_constructor.ts'
import { FromCyclic } from './from_cyclic.ts'
import { FromEnum } from './from_enum.ts'
import { FromFunction } from './from_function.ts'
import { FromInteger } from './from_integer.ts'
import { FromIntersect } from './from_intersect.ts'
import { FromIterator } from './from_iterator.ts'
import { FromLiteral } from './from_literal.ts'
import { FromNever } from './from_never.ts'
import { FromNull } from './from_null.ts'
import { FromNumber } from './from_number.ts'
import { FromObject } from './from_object.ts'
import { FromPromise } from './from_promise.ts'
import { FromRecord } from './from_record.ts'
import { FromRef } from './from_ref.ts'
import { FromString } from './from_string.ts'
import { FromSymbol } from './from_symbol.ts'
import { FromTemplateLiteral } from './from_template_literal.ts'
import { FromTuple } from './from_tuple.ts'
import { FromUndefined } from './from_undefined.ts'
import { FromUnion } from './from_union.ts'
import { FromVoid } from './from_void.ts'

export function FromType(context: T.TProperties, type: T.TSchema): unknown {
  return (
    // -----------------------------------------------------
    // Default
    // -----------------------------------------------------
    S.IsDefault(type) ? FromDefault(context, type) :
    // -----------------------------------------------------
    // Types
    // -----------------------------------------------------
    T.IsArray(type) ? FromArray(context, type) :
    T.IsAsyncIterator(type) ? FromAsyncIterator(context, type) :
    T.IsBase(type) ? FromBase(context, type) :
    T.IsBigInt(type) ? FromBigInt(context, type) :
    T.IsBoolean(type) ? FromBoolean(context, type) :
    T.IsConstructor(type) ? FromConstructor(context, type) :
    T.IsCyclic(type) ? FromCyclic(context, type) :
    T.IsEnum(type) ? FromEnum(context, type) :
    T.IsFunction(type) ? FromFunction(context, type) :
    T.IsInteger(type) ? FromInteger(context, type) :
    T.IsIntersect(type) ? FromIntersect(context, type) :
    T.IsIterator(type) ? FromIterator(context, type) :
    T.IsLiteral(type) ? FromLiteral(context, type) :
    T.IsNever(type) ? FromNever(context, type) :
    T.IsNull(type) ? FromNull(context, type) :
    T.IsNumber(type) ? FromNumber(context, type) :
    T.IsObject(type) ? FromObject(context, type) :
    T.IsPromise(type) ? FromPromise(context, type) :
    T.IsRecord(type) ? FromRecord(context, type) :
    T.IsRef(type) ? FromRef(context, type) :
    T.IsString(type) ? FromString(context, type) :
    T.IsSymbol(type) ? FromSymbol(context, type) :
    T.IsTemplateLiteral(type) ? FromTemplateLiteral(context, type) :
    T.IsTuple(type) ? FromTuple(context, type) :
    T.IsUndefined(type) ? FromUndefined(context, type) :
    T.IsUnion(type) ? FromUnion(context, type) :
    T.IsVoid(type) ? FromVoid(context, type) :
    undefined
  )
}
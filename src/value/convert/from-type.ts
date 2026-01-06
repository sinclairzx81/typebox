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

import { FromArray } from './from-array.ts'
import { FromBigInt } from './from-bigint.ts'
import { FromBoolean } from './from-boolean.ts'
import { FromCyclic } from './from-cyclic.ts'
import { FromEnum } from './from-enum.ts'
import { FromInteger } from './from-integer.ts'
import { FromIntersect } from './from-intersect.ts'
import { FromLiteral } from './from-literal.ts'
import { FromNull } from './from-null.ts'
import { FromNumber } from './from-number.ts'
import { FromObject } from './from-object.ts'
import { FromRecord } from './from-record.ts'
import { FromRef } from './from-ref.ts'
import { FromString } from './from-string.ts'
import { FromTemplateLiteral } from './from-template-literal.ts'
import { FromTuple } from './from-tuple.ts'
import { FromUndefined } from './from-undefined.ts'
import { FromUnion } from './from-union.ts'
import { FromVoid } from './from-void.ts'

export function FromType(context: T.TProperties, type: T.TSchema, value: unknown): unknown {
  return (
    T.IsArray(type) ? FromArray(context, type, value) :
    T.IsBigInt(type) ? FromBigInt(context, type, value) :
    T.IsBoolean(type) ? FromBoolean(context, type, value) :
    T.IsCyclic(type) ? FromCyclic(context, type, value) :
    T.IsEnum(type) ? FromEnum(context, type, value) :
    T.IsInteger(type) ? FromInteger(context, type, value) :
    T.IsIntersect(type) ? FromIntersect(context, type, value) :
    T.IsLiteral(type) ? FromLiteral(context, type, value) :
    T.IsNull(type) ? FromNull(context, type, value) :
    T.IsNumber(type) ? FromNumber(context, type, value) :
    T.IsObject(type) ? FromObject(context, type, value) :
    T.IsRecord(type) ? FromRecord(context, type, value) :
    T.IsRef(type) ? FromRef(context, type, value) :
    T.IsString(type) ? FromString(context, type, value) :
    T.IsTemplateLiteral(type) ? FromTemplateLiteral(context, type, value) :
    T.IsTuple(type) ? FromTuple(context, type, value) :
    T.IsUndefined(type) ? FromUndefined(context, type, value) :
    T.IsUnion(type) ? FromUnion(context, type, value) : 
    T.IsVoid(type) ? FromVoid(context, type, value) :
    value
  )
}
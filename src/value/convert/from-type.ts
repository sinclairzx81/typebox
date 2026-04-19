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

export function FromType(context: Type.TProperties, type: Type.TSchema, value: unknown): unknown {
  return (
    Type.IsArray(type) ? FromArray(context, type, value) :
    Type.IsBigInt(type) ? FromBigInt(context, type, value) :
    Type.IsBoolean(type) ? FromBoolean(context, type, value) :
    Type.IsCyclic(type) ? FromCyclic(context, type, value) :
    Type.IsEnum(type) ? FromEnum(context, type, value) :
    Type.IsInteger(type) ? FromInteger(context, type, value) :
    Type.IsIntersect(type) ? FromIntersect(context, type, value) :
    Type.IsLiteral(type) ? FromLiteral(context, type, value) :
    Type.IsNull(type) ? FromNull(context, type, value) :
    Type.IsNumber(type) ? FromNumber(context, type, value) :
    Type.IsObject(type) ? FromObject(context, type, value) :
    Type.IsRecord(type) ? FromRecord(context, type, value) :
    Type.IsRef(type) ? FromRef(context, type, value) :
    Type.IsString(type) ? FromString(context, type, value) :
    Type.IsTemplateLiteral(type) ? FromTemplateLiteral(context, type, value) :
    Type.IsTuple(type) ? FromTuple(context, type, value) :
    Type.IsUndefined(type) ? FromUndefined(context, type, value) :
    Type.IsUnion(type) ? FromUnion(context, type, value) : 
    Type.IsVoid(type) ? FromVoid(context, type, value) :
    value
  )
}
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

import { Guard, GlobalsGuard } from '../../guard/index.ts'
import * as T from '../../type/index.ts'

import { FromArray } from './from-array.ts'
import { FromBase } from './from-base.ts'
import { FromEnum } from './from-enum.ts'
import { FromIntersect } from './from-intersect.ts'
import { FromObject } from './from-object.ts'
import { FromRecord } from './from-record.ts'
import { FromRef } from './from-ref.ts'
import { FromTemplateLiteral } from './from-template-literal.ts'
import { FromTuple } from './from-tuple.ts'
import { FromUnion } from './from-union.ts'
import { FromUnknown } from './from-unknown.ts'
import { RepairError } from './error.ts'

// ------------------------------------------------------------------
// AssertRepairableValue
// ------------------------------------------------------------------
function AssertRepairableValue(context: T.TProperties, type: T.TSchema, value: unknown): void {
  const unsupported = GlobalsGuard.IsDate(value)
    || GlobalsGuard.IsMap(value)
    || GlobalsGuard.IsSet(value)
    || GlobalsGuard.IsTypeArray(value)
    || Guard.IsConstructor(value)
    || Guard.IsFunction(value)
  if(unsupported) {
    throw new RepairError(context, type, value, 'Value is not repairable')
  }
}
// ------------------------------------------------------------------
// AssertRepairableType
// ------------------------------------------------------------------
function AssertRepairableType(context: T.TProperties, type: T.TSchema, value: unknown): void {
  const unsupported = T.IsAsyncIterator(type)
    || T.IsIterator(type)
    || T.IsConstructor(type)
    || T.IsFunction(type)
    || T.IsNever(type)
    || T.IsPromise(type)
  if(unsupported) {
    throw new RepairError(context, type, value, 'Type is not repairable')
  }
}
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
export function FromType(context: T.TProperties, type: T.TSchema, value: unknown): unknown {
  // Intercept Base
  if (T.IsBase(type)) return FromBase(context, type, value)
  // Standard Repair
  AssertRepairableValue(context, type, value)
  AssertRepairableType(context, type, value)
  return (
    T.IsArray(type) ? FromArray(context, type, value) :
    T.IsEnum(type) ? FromEnum(context, type, value) :
    T.IsIntersect(type) ? FromIntersect(context, type, value) :
    T.IsObject(type) ? FromObject(context, type, value) :
    T.IsRecord(type) ? FromRecord(context, type, value) :
    T.IsRef(type) ? FromRef(context, type, value) :
    T.IsTemplateLiteral(type) ? FromTemplateLiteral(context, type, value) :
    T.IsTuple(type) ? FromTuple(context, type, value) :
    T.IsUnion(type) ? FromUnion(context, type, value) :
    FromUnknown(context, type, value)
  )
}
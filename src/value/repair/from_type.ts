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

import { Guard, GlobalsGuard } from '../../guard/index.ts'
import * as T from '../../type/index.ts'
import { Check } from '../check/index.ts'
import { Create } from '../create/index.ts'

import { FromArray } from './from_array.ts'
import { FromEnum } from './from_enum.ts'
import { FromIntersect } from './from_intersect.ts'
import { FromObject } from './from_object.ts'
import { FromRecord } from './from_record.ts'
import { FromRef } from './from_ref.ts'
import { FromTemplateLiteral } from './from_template_literal.ts'
import { FromTuple } from './from_tuple.ts'
import { FromUnion } from './from_union.ts'
import { FromUnknown } from './from_unknown.ts'
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
  const unsupported = T.IsConstructor(type)
    || T.IsFunction(type)
    || T.IsNever(type)
  if(unsupported) {
    throw new RepairError(context, type, value, 'Type is not repairable')
  }
}
// ------------------------------------------------------------------
// CreateWhenUndefined
//
// If the value is 'undefined' AND the type is not TUndefined, then 
// we know the value must be created. We handle this case for undefined 
// only as it enables 'default' annotation to be initialized via Create 
// before we applying subsequent Repair logic.
// ------------------------------------------------------------------
function CreateWhenUndefined(context: T.TProperties, type: T.TSchema, value: unknown): unknown {
  return (Guard.IsUndefined(value) && !T.IsUndefined(type)) ? Create(context, type) : value
}
// ------------------------------------------------------------------
// FinalizeRepair
//
// When a type includes the ~refine modifier, a post-repair validation
// check must be performed to ensure the repaired value satisfies the
// refine constraint. This logic is implemented as part of FromType to
// ensure the post-refine validation check is handled outside of
// sub-schema constraint checking (i.e., at the top level).
//
// ------------------------------------------------------------------
function FinalizeRepair(context: T.TProperties, type: T.TSchema, repaired: unknown): unknown {
  return T.IsRefine(type) 
    ? Check(context, type, repaired) 
      ? repaired 
      : Create(context, type) 
    : repaired
}
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
export function FromType(context: T.TProperties, type: T.TSchema, value: unknown): unknown {
  AssertRepairableValue(context, type, value)
  AssertRepairableType(context, type, value)
  const candidate = CreateWhenUndefined(context, type, value)
  const repaired = (
    T.IsArray(type) ? FromArray(context, type, candidate) :
    T.IsEnum(type) ? FromEnum(context, type, candidate) :
    T.IsIntersect(type) ? FromIntersect(context, type, candidate) :
    T.IsObject(type) ? FromObject(context, type, candidate) :
    T.IsRecord(type) ? FromRecord(context, type, candidate) :
    T.IsRef(type) ? FromRef(context, type, candidate) :
    T.IsTemplateLiteral(type) ? FromTemplateLiteral(context, type, candidate) :
    T.IsTuple(type) ? FromTuple(context, type, candidate) :
    T.IsUnion(type) ? FromUnion(context, type, candidate) :
    FromUnknown(context, type, candidate)
  )
  return FinalizeRepair(context, type, repaired)
}
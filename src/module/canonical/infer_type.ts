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

import * as Schema from '../../schema/index.ts'
import * as Type from '../../type/index.ts'

import { IsAnyLike, InferAny } from './infer_any.ts'
import { IsArrayLike, InferArray } from './infer_array.ts'
import { IsBigIntLike, InferBigInt } from './infer_bigint.ts'
import { IsBooleanLike, InferBoolean } from './infer_boolean.ts'
import { IsConstructorLike, InferConstructor } from './infer_constructor.ts'
import { IsCyclicLike, InferCyclic } from './infer_cyclic.ts'
import { IsEnumLike, InferEnum } from './infer_enum.ts'
import { IsFunctionLike, InferFunction } from './infer_function.ts'
import { IsIntegerLike, InferInteger } from './infer_integer.ts'
import { IsIntersectLike, InferIntersect } from './infer_intersect.ts'
import { IsLiteralLike, InferLiteral } from './infer_literal.ts'
import { IsNeverLike, InferNever } from './infer_never.ts'
import { IsNullLike, InferNull } from './infer_null.ts'
import { IsNumberLike, InferNumber } from './infer_number.ts'
import { IsObjectLike, InferObject } from './infer_object.ts'
import { IsRecordLike, InferRecord } from './infer_record.ts'
import { IsRefLike, InferRef } from './infer_ref.ts'
import { IsStringLike, InferString } from './infer_string.ts'
import { IsSymbolLike, InferSymbol } from './infer_symbol.ts'
import { IsTemplateLiteralLike, InferTemplateLiteral } from './infer_template_literal.ts'
import { IsThisLike, InferThis } from './infer_this.ts'
import { IsTupleLike, InferTuple } from './infer_tuple.ts'
import { IsUndefinedLike, InferUndefined } from './infer_undefined.ts'
import { IsUnionLike, InferUnion } from './infer_union.ts'
import { IsVoidLike, InferVoid } from './infer_void.ts'

// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferType(stack: Schema.XStack, schema: Schema.XSchema): Type.TSchema {
  // Inferred
  const inferred = (
    IsAnyLike(schema) ? InferAny(stack, schema) :
    IsArrayLike(schema) ? InferArray(stack, schema) :
    IsBigIntLike(schema) ? InferBigInt(stack, schema) :
    IsBooleanLike(schema) ? InferBoolean(stack, schema) :
    IsConstructorLike(schema) ? InferConstructor(stack, schema) :
    IsCyclicLike(schema) ? InferCyclic(stack, schema) :
    IsEnumLike(schema) ? InferEnum(stack, schema) :
    IsFunctionLike(schema) ? InferFunction(stack, schema) :
    IsIntegerLike(schema) ? InferInteger(stack, schema) :
    IsIntersectLike(schema) ? InferIntersect(stack, schema) :
    IsLiteralLike(schema) ? InferLiteral(stack, schema) :
    IsNeverLike(schema) ? InferNever(stack, schema) :
    IsNullLike(schema) ? InferNull(stack, schema) :
    IsNumberLike(schema) ? InferNumber(stack, schema) :
    IsObjectLike(schema) ? InferObject(stack, schema) :
    IsRecordLike(schema) ? InferRecord(stack, schema) :
    IsRefLike(schema) ? InferRef(stack, schema) :
    IsStringLike(schema) ? InferString(stack, schema) :
    IsSymbolLike(schema) ? InferSymbol(stack, schema) :
    IsTemplateLiteralLike(schema) ? InferTemplateLiteral(stack, schema) :
    IsThisLike(schema) ? InferThis(stack, schema) :
    IsTupleLike(schema) ? InferTuple(stack, schema) :
    IsUndefinedLike(schema) ? InferUndefined(stack, schema) :
    IsUnionLike(schema) ? InferUnion(stack, schema) :
    IsVoidLike(schema) ? InferVoid(stack, schema) :
    Type.Unknown({ inferred: false })
  )
  // With Modifiers
  const withOptional = Type.IsOptional(schema) ? Type.Optional(inferred) : inferred
  const withReadonly = Type.IsReadonly(schema) ? Type.Readonly(withOptional) : withOptional
  const withImmutable = Type.IsImmutable(schema) ? Type.Immutable(withReadonly) : withReadonly
  return withImmutable
}
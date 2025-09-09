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

// deno-lint-ignore-file
// deno-fmt-ignore-file

import type { StaticCodec, TCodec } from './_codec.ts'

import type { StaticAny, TAny } from './any.ts'
import type { StaticArray, TArray } from './array.ts'
import type { StaticAsyncIterator, TAsyncIterator } from './async-iterator.ts'
import type { StaticBigInt, TBigInt } from './bigint.ts'
import type { StaticBoolean, TBoolean } from './boolean.ts'
import type { StaticConstructor, TConstructor } from './constructor.ts'
import type { StaticCyclic, TCyclic } from './cyclic.ts'
import type { StaticEnum, TEnum, TEnumValue } from './enum.ts'
import type { StaticFunction, TFunction } from './function.ts'
import type { StaticInteger, TInteger } from './integer.ts'
import type { StaticIntersect, TIntersect } from './intersect.ts'
import type { StaticIterator, TIterator } from './iterator.ts'
import type { StaticLiteral, TLiteral, TLiteralValue } from './literal.ts'
import type { StaticNever, TNever } from './never.ts'
import type { StaticNull, TNull, } from './null.ts'
import type { StaticNumber, TNumber } from './number.ts'
import type { StaticObject, TObject } from './object.ts'
import type { StaticPromise, TPromise } from './promise.ts'
import type { TProperties } from './properties.ts'
import type { StaticRecord, TRecord  } from './record.ts'
import type { StaticRef, TRef } from './ref.ts'
import type { TSchema } from './schema.ts'
import type { StaticString, TString } from './string.ts'
import type { StaticSymbol, TSymbol } from './symbol.ts'
import type { StaticTemplateLiteral, TTemplateLiteral} from './template-literal.ts'
import type { StaticThis, TThis } from './this.ts'
import type { StaticTuple, TTuple } from './tuple.ts'
import type { StaticUndefined, TUndefined } from './undefined.ts'
import type { StaticUnion, TUnion } from './union.ts'
import type { StaticUnknown, TUnknown } from './unknown.ts'
import type { StaticUnsafe, TUnsafe } from './unsafe.ts'
import type { StaticVoid, TVoid } from './void.ts'

// ------------------------------------------------------------------
// XStatic
// ------------------------------------------------------------------
import type { XStatic } from '../../schema/types/static.ts'

// ------------------------------------------------------------------
// StaticEvaluate
// ------------------------------------------------------------------
export type StaticEvaluate<T> = { [K in keyof T]: T[K] } & {}

export type StaticDirection = 'Encode' | 'Decode'

// ------------------------------------------------------------------
// StaticType
// ------------------------------------------------------------------
export type StaticType<Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Type extends TSchema> = (
  Type extends TCodec<infer Type extends TSchema, infer Decoded extends unknown> ? StaticCodec<Direction, Context, This, Type, Decoded> :
  Type extends TAny ? StaticAny :
  Type extends TArray<infer Type extends TSchema> ? StaticArray<Direction, Context, This, Type> :
  Type extends TAsyncIterator<infer Type extends TSchema> ? StaticAsyncIterator<Direction, Context, This, Type> :
  Type extends TBigInt ? StaticBigInt :
  Type extends TBoolean ? StaticBoolean :
  Type extends TConstructor<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? StaticConstructor<Direction, Context, This, Parameters, ReturnType> :
  Type extends TEnum<infer Values extends TEnumValue[]> ? StaticEnum<Values> :
  Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? StaticFunction<Direction, Context, This, Parameters, ReturnType> :
  Type extends TInteger ? StaticInteger :
  Type extends TIntersect<infer Types extends TSchema[]> ? StaticIntersect<Direction, Context, This, Types> :
  Type extends TIterator<infer Types extends TSchema> ? StaticIterator<Direction, Context, This, Types> :
  Type extends TLiteral<infer Value extends TLiteralValue> ? StaticLiteral<Value> :
  Type extends TNever ? StaticNever :
  Type extends TNull ? StaticNull :
  Type extends TNumber ? StaticNumber :
  Type extends TObject<infer Properties extends TProperties> ? StaticObject<Direction, Context, This, Properties> :
  Type extends TPromise<infer Type extends TSchema> ? StaticPromise<Direction, Context, This, Type> :
  Type extends TRecord<infer Key extends string, infer Value extends TSchema> ? StaticRecord<Direction, Context, This, Key, Value> :
  Type extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? StaticCyclic<Direction, Context, This, Defs, Ref> :
  Type extends TRef<infer Ref extends string> ? StaticRef<Direction, Context, This, Ref> :
  Type extends TString ? StaticString :
  Type extends TSymbol ? StaticSymbol :
  Type extends TTemplateLiteral<infer Pattern extends string> ? StaticTemplateLiteral<Pattern> :
  Type extends TThis ? StaticThis<Direction, Context, This> :
  Type extends TTuple<infer Types extends TSchema[]> ? StaticTuple<Direction, Context, This, Types> :
  Type extends TUndefined ? StaticUndefined :
  Type extends TUnion<infer Types extends TSchema[]> ? StaticUnion<Direction, Context, This, Types> :
  Type extends TUnknown ? StaticUnknown :
  Type extends TUnsafe<infer Type extends unknown> ? StaticUnsafe<Type> :
  Type extends TVoid ? StaticVoid :
  XStatic<Type>
)
// ------------------------------------------------------------------
// Statics
// ------------------------------------------------------------------
/** Infers a static type from a TypeBox type using Parse logic. */
export type StaticParse<Type extends TSchema, Context extends TProperties = {}> = StaticType<'Decode', Context, {}, Type>
/** Infers a static type from a TypeBox type using Decode logic. */
export type StaticDecode<Type extends TSchema, Context extends TProperties = {}> = StaticType<'Decode', Context, {}, Type>
/** Infers a static type from a TypeBox type using Encode logic. */
export type StaticEncode<Type extends TSchema, Context extends TProperties = {}> = StaticType<'Encode', Context, {}, Type>
/** Infers a static type from a TypeBox type. */
export type Static<Type extends TSchema, Context extends TProperties = {}> = StaticType<'Encode', Context, {}, Type>
/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import type { Evaluate } from '../helpers/index'
import type { TOptional } from '../optional/index'
import type { TReadonly } from '../readonly/index'
import type { TArray } from '../array/index'
import type { TAsyncIterator } from '../async-iterator/index'
import type { TConstructor } from '../constructor/index'
import type { TEnum } from '../enum/index'
import type { TFunction } from '../function/index'
import type { TIntersect } from '../intersect/index'
import type { TIterator } from '../iterator/index'
import type { TNot } from '../not/index'
import type { TObject, TProperties } from '../object/index'
import type { TPromise } from '../promise/index'
import type { TRecursive } from '../recursive/index'
import type { TRecord } from '../record/index'
import type { TRef } from '../ref/index'
import type { TTuple } from '../tuple/index'
import type { TUnion } from '../union/index'
import type { TUnsafe } from '../unsafe/index'
import type { TSchema } from '../schema/index'
import type { TTransform } from '../transform/index'

// ------------------------------------------------------------------
// DecodeType
// ------------------------------------------------------------------
// prettier-ignore
export type DecodeProperties<T extends TProperties> = {
  [K in keyof T]: DecodeType<T[K]>
}
// prettier-ignore
export type DecodeRest<T extends TSchema[], Acc extends TSchema[] = []> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? DecodeRest<R, [...Acc, DecodeType<L>]>
    : Acc
// prettier-ignore
export type DecodeType<T extends TSchema> = (
  T extends TOptional<infer S extends TSchema> ? TOptional<DecodeType<S>> :
  T extends TReadonly<infer S extends TSchema> ? TReadonly<DecodeType<S>> :
  T extends TTransform<infer _, infer R> ? TUnsafe<R> :
  T extends TArray<infer S extends TSchema> ? TArray<DecodeType<S>> :
  T extends TAsyncIterator<infer S extends TSchema> ? TAsyncIterator<DecodeType<S>> :
  T extends TConstructor<infer P extends TSchema[], infer R extends TSchema> ? TConstructor<DecodeRest<P>, DecodeType<R>> :
  T extends TEnum<infer S> ? TEnum<S> : // intercept for union. interior non decodable
  T extends TFunction<infer P extends TSchema[], infer R extends TSchema> ? TFunction<DecodeRest<P>, DecodeType<R>> :
  T extends TIntersect<infer S extends TSchema[]> ? TIntersect<DecodeRest<S>> :
  T extends TIterator<infer S extends TSchema> ? TIterator<DecodeType<S>> :
  T extends TNot<infer S extends TSchema> ? TNot<DecodeType<S>> :
  T extends TObject<infer S> ? TObject<Evaluate<DecodeProperties<S>>> :
  T extends TPromise<infer S extends TSchema> ? TPromise<DecodeType<S>> :
  T extends TRecord<infer K, infer S> ? TRecord<K, DecodeType<S>> :
  T extends TRecursive<infer S extends TSchema> ? TRecursive<DecodeType<S>> :
  T extends TRef<infer S extends TSchema> ? TRef<DecodeType<S>> :
  T extends TTuple<infer S extends TSchema[]> ? TTuple<DecodeRest<S>> :
  T extends TUnion<infer S extends TSchema[]> ? TUnion<DecodeRest<S>> :
  T
)
// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
/** Creates an decoded static type from a TypeBox type */
export type StaticDecode<T extends TSchema, P extends unknown[] = []> = Static<DecodeType<T>, P>
/** Creates an encoded static type from a TypeBox type */
export type StaticEncode<T extends TSchema, P extends unknown[] = []> = Static<T, P>
/** Creates a static type from a TypeBox type */
export type Static<T extends TSchema, P extends unknown[] = []> = (T & { params: P })['static']

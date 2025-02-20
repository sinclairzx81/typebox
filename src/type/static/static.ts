/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
import type { TImport } from '../module/index'
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
import type { TNever } from '../never/index'

// ------------------------------------------------------------------
// Import
// ------------------------------------------------------------------
// prettier-ignore
type TDecodeImport<ModuleProperties extends TProperties, Key extends PropertyKey> = (
  Key extends keyof ModuleProperties 
    ? TDecodeType<ModuleProperties[Key]> extends infer Type extends TSchema
      ? Type extends TRef<infer Ref extends string>
        ? TDecodeImport<ModuleProperties, Ref>
        : Type 
    : TNever
  : TNever
)
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
// prettier-ignore
type TDecodeProperties<Properties extends TProperties> = {
  [Key in keyof Properties]: TDecodeType<Properties[Key]>
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
// prettier-ignore
type TDecodeTypes<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TDecodeTypes<Right, [...Result, TDecodeType<Left>]>
    : Result
)
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
// prettier-ignore
export type TDecodeType<Type extends TSchema> = (
  Type extends TOptional<infer Type extends TSchema> ? TOptional<TDecodeType<Type>> :
  Type extends TReadonly<infer Type extends TSchema> ? TReadonly<TDecodeType<Type>> :
  Type extends TTransform<infer _Input extends TSchema, infer Output> ? TUnsafe<Output> :
  Type extends TArray<infer Type extends TSchema> ? TArray<TDecodeType<Type>> :
  Type extends TAsyncIterator<infer Type extends TSchema> ? TAsyncIterator<TDecodeType<Type>> :
  Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TConstructor<TDecodeTypes<Parameters>, TDecodeType<InstanceType>> :
  Type extends TEnum<infer Values> ? TEnum<Values> : // intercept for union. interior non decodable
  Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFunction<TDecodeTypes<Parameters>, TDecodeType<ReturnType>> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TDecodeTypes<Types>> :
  Type extends TImport<infer ModuleProperties extends TProperties, infer Key> ? TDecodeImport<ModuleProperties, Key> :
  Type extends TIterator<infer Type extends TSchema> ? TIterator<TDecodeType<Type>> :
  Type extends TNot<infer Type extends TSchema> ? TNot<TDecodeType<Type>> :
  Type extends TObject<infer Properties extends TProperties> ? TObject<Evaluate<TDecodeProperties<Properties>>> :
  Type extends TPromise<infer Type extends TSchema> ? TPromise<TDecodeType<Type>> :
  Type extends TRecord<infer Key extends TSchema, infer Value extends TSchema> ? TRecord<Key, TDecodeType<Value>> :
  Type extends TRecursive<infer Type extends TSchema> ? TRecursive<TDecodeType<Type>> :
  Type extends TRef<infer Ref extends string> ? TRef<Ref> :
  Type extends TTuple<infer Types extends TSchema[]> ? TTuple<TDecodeTypes<Types>> :
  Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TDecodeTypes<Types>> :
  Type
)
// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticDecodeIsAny<Type> = boolean extends (Type extends TSchema ? true : false) ? true : false
/** Creates an decoded static type from a TypeBox type */
// prettier-ignore
export type StaticDecode<Type extends TSchema, Params extends unknown[] = [],
  Result = StaticDecodeIsAny<Type> extends true ? unknown : Static<TDecodeType<Type>, Params>
> = Result
/** Creates an encoded static type from a TypeBox type */
export type StaticEncode<Type extends TSchema, Params extends unknown[] = [], Result = Static<Type, Params>> = Result
/** Creates a static type from a TypeBox type */
export type Static<Type extends TSchema, Params extends unknown[] = [], Result = (Type & { params: Params })['static']> = Result

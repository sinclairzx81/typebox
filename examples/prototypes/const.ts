/*--------------------------------------------------------------------------

@sinclair/typebox/prototypes

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

import { Type, ObjectMap, TypeGuard, TSchema, TIntersect, TUnion, TObject, TProperties, TReadonly, AssertProperties, AssertType, AssertRest, Evaluate, ReadonlyUnwrapType } from '@sinclair/typebox'

// -------------------------------------------------------------------------------------
// TConst
// -------------------------------------------------------------------------------------
// prettier-ignore
export type TConstArray<T extends TSchema[], E extends boolean> = T extends [infer L, ...infer R]
  ? [TConst<AssertType<L>, E>, ...TConstArray<AssertRest<R>, E>]
  : []
// prettier-ignore
export type TConstProperties<T extends TProperties, E extends boolean> = Evaluate<AssertProperties<{
  [K in keyof T]: TConst<ReadonlyUnwrapType<T[K]>, E>
}>>
// prettier-ignore
export type TConst<T extends TSchema, E extends boolean> =
  T extends TIntersect<infer S> ? TIntersect<TConstArray<S, false>> :
  T extends TUnion<infer S> ? TUnion<TConstArray<S, false>> :
  T extends TObject<infer S> ? TObject<TConstProperties<S, false>> :
  E extends true ? T : TReadonly<T>
// -------------------------------------------------------------------------------------
// Const
// -------------------------------------------------------------------------------------
/** `[Experimental]` Assigns readonly to all interior properties */
export function Const<T extends TSchema>(schema: T): TConst<T, true> {
  const mappable = (TypeGuard.TIntersect(schema) || TypeGuard.TUnion(schema) || TypeGuard.TObject(schema))
  // prettier-ignore
  return mappable ? ObjectMap.Map(schema, (object) => {
    const properties = Object.getOwnPropertyNames(object.properties).reduce((acc, key) => {
      return { ...acc, [key]: Type.Readonly(object.properties[key] )}
    }, {} as TProperties)
    return Type.Object(properties, {...object})
  }, {}) : schema as any
}
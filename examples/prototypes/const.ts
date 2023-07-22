/*--------------------------------------------------------------------------

@sinclair/typebox/experimental

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

import * as Types from '@sinclair/typebox'

// -------------------------------------------------------------------------------------
// TConst
// -------------------------------------------------------------------------------------
export type TConstArray<T extends Types.TSchema[], E extends boolean> = T extends [infer L, ...infer R]
  ? [TConst<Types.AssertType<L>, E>, ...TConstArray<Types.AssertRest<R>, E>]
  : []
// prettier-ignore
export type TConstProperties<T extends Types.TProperties, E extends boolean> = Types.Evaluate<Types.Assert<{
  [K in keyof T]: TConst<Types.ReadonlyUnwrapType<T[K]>, E>
}, Types.TProperties>>
// prettier-ignore
export type TConst<T extends Types.TSchema, E extends boolean> =
  T extends Types.TIntersect<infer S> ? Types.TIntersect<TConstArray<S, false>> :
  T extends Types.TUnion<infer S> ? Types.TUnion<TConstArray<S, false>> :
  T extends Types.TObject<infer S> ? Types.TObject<TConstProperties<S, false>> :
  E extends true ? T : Types.TReadonly<T>
/** `[Experimental]` Assigns readonly to all interior properties */
export function Const<T extends Types.TSchema>(schema: T): TConst<T, true> {
  const mappable = (Types.TypeGuard.TIntersect(schema) || Types.TypeGuard.TUnion(schema) || Types.TypeGuard.TObject(schema))
  // prettier-ignore
  return mappable ? Types.ObjectMap.Map(schema, (object) => {
    const properties = Object.getOwnPropertyNames(object.properties).reduce((acc, key) => {
      return { ...acc, [key]: Types.Type.Readonly(object.properties[key] )}
    }, {} as Types.TProperties)
    return Types.Type.Object(properties, {...object})
  }, {}) : schema as any
}
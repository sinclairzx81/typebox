/*--------------------------------------------------------------------------

@sinclair/typebox/prototypes

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { TypeGuard, Type, TSchema, TIntersect, TUnion, TObject, TPartial, TProperties, Evaluate } from '@sinclair/typebox'

// -------------------------------------------------------------------------------------
// TDeepPartial
// -------------------------------------------------------------------------------------
export type TPartialDeepProperties<T extends TProperties> = {
  [K in keyof T]: TPartial<T[K]>
}
export type TPartialDeepRest<T extends TSchema[]> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? [TPartial<L>, ...TPartialDeepRest<R>]
    : []
export type TPartialDeep<T extends TSchema> = 
  T extends TIntersect<infer S> ? TIntersect<TPartialDeepRest<S>> :
  T extends TUnion<infer S> ? TUnion<TPartialDeepRest<S>> :
  T extends TObject<infer S> ? TPartial<TObject<Evaluate<TPartialDeepProperties<S>>>> :
  T
// -------------------------------------------------------------------------------------
// DeepPartial
// -------------------------------------------------------------------------------------
function PartialDeepProperties<T extends TProperties>(properties: T) {
  return Object.getOwnPropertyNames(properties).reduce((acc, key) => {
    return {...acc, [key]: Type.Partial(properties[key])}
  }, {} as TProperties)
}
function PartialDeepRest<T extends TSchema[]>(rest: [...T]): TPartialDeepRest<T> {
  const [L, ...R] = rest
  return (R.length > 0) ? [Type.Partial(L), ...PartialDeepRest(R)] : [] as any
}
/** Maps the given schema as deep partial, making all properties and sub properties optional */
export function PartialDeep<T extends TSchema>(type: T): TPartialDeep<T> {
  return (
    TypeGuard.IsIntersect(type) ? Type.Intersect(PartialDeepRest(type.allOf)) :
    TypeGuard.IsUnion(type) ? Type.Union(PartialDeepRest(type.anyOf)) :
    TypeGuard.IsObject(type) ? Type.Partial(Type.Object(PartialDeepProperties(type.properties))) :
    type
  ) as any
}
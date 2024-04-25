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
// TPartialDeepProperties
// -------------------------------------------------------------------------------------
export type TPartialDeepProperties<T extends TProperties> = {
  [K in keyof T]: TPartialDeep<T[K]>
}
function PartialDeepProperties<T extends TProperties>(properties: T): TPartialDeepProperties<T> {
  return Object.getOwnPropertyNames(properties).reduce((acc, key) => {
    return {...acc, [key]: PartialDeep(properties[key])}
  }, {}) as never
}
// -------------------------------------------------------------------------------------
// TPartialDeepRest
// -------------------------------------------------------------------------------------
export type TPartialDeepRest<T extends TSchema[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TPartialDeepRest<R, [...Acc, TPartialDeep<L>]>
    : Acc
)
function PartialDeepRest<T extends TSchema[]>(rest: [...T]): TPartialDeepRest<T> {
  return rest.map(schema => PartialDeep(schema)) as never
}
// -------------------------------------------------------------------------------------
// TPartialDeep
// -------------------------------------------------------------------------------------
export type TPartialDeep<T extends TSchema> = 
  T extends TIntersect<infer S> ? TIntersect<TPartialDeepRest<S>> :
  T extends TUnion<infer S> ? TUnion<TPartialDeepRest<S>> :
  T extends TObject<infer S> ? TPartial<TObject<Evaluate<TPartialDeepProperties<S>>>> :
  T
export function PartialDeep<T extends TSchema>(schema: T): TPartialDeep<T> {
  return (
    TypeGuard.IsIntersect(schema) ? Type.Intersect(PartialDeepRest(schema.allOf)) :
    TypeGuard.IsUnion(schema) ? Type.Union(PartialDeepRest(schema.anyOf)) :
    TypeGuard.IsObject(schema) ? Type.Partial(Type.Object(PartialDeepProperties(schema.properties))) :
    schema
  ) as never
}
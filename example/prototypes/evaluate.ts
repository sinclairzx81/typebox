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

import {
  AssertRest,
  AssertType,
  Static,  
  Type, 
  TypeGuard, 
  TSchema,  
  TObject, 
  Evaluate, 
  TArray, 
  TFunction, 
  TConstructor, 
  TPromise, 
  TIterator, 
  TAsyncIterator, 
  TTuple, 
  TProperties, 
  TIntersect, 
  TUnion, 
  TNever 
} from '@sinclair/typebox'

// --------------------------------------------------------------------------
// TEvaluate
// --------------------------------------------------------------------------
// prettier-ignore
export type TEvaluateIntersectType<L extends TSchema, R extends TSchema> = (
  Static<L> extends Static<R> ? 
    Static<R> extends Static<L> ? R :
    Static<L> extends Static<R> ? L :
    TNever : 
  Static<R> extends Static<L> ? R : 
    TNever
)
// prettier-ignore
export type TEvaluateIntersectRest<T extends TSchema[]> = 
  T extends [infer L, infer R, ...infer Rest] ? TEvaluateIntersectRest<[TEvaluateIntersectType<AssertType<L>, AssertType<R>>, ...AssertRest<Rest>]> : 
  T
// prettier-ignore
export type TEvaluateProperties<T extends TProperties> = Evaluate<{
  [K in keyof T]: TEvaluate<T[K]>
}>
// prettier-ignore
export type TEvaluateArray<T extends TSchema[]> =  T extends [infer L, ...infer R] ? 
  [TEvaluate<AssertType<L>>, ...TEvaluateArray<AssertRest<R>>] : 
  []
// prettier-ignore
export type TEvaluate<T extends TSchema> = 
  T extends TIntersect<infer S>            ? TIntersect<TEvaluateIntersectRest<S>> :
  T extends TUnion<infer S>                ? TUnion<TEvaluateArray<S>> :
  T extends TConstructor<infer P, infer R> ? TConstructor<TEvaluateArray<P>, TEvaluate<R>> : 
  T extends TFunction<infer P, infer R>    ? TFunction<TEvaluateArray<P>, TEvaluate<R>> : 
  T extends TObject<infer S>               ? TObject<TEvaluateProperties<S>> : 
  T extends TTuple<infer S>                ? TTuple<TEvaluateArray<S>> :
  T extends TArray<infer S>                ? TArray<TEvaluate<S>> :
  T extends TPromise<infer S>              ? TPromise<TEvaluate<S>> :
  T extends TIterator<infer S>             ? TIterator<TEvaluate<S>> :
  T extends TAsyncIterator<infer S>        ? TAsyncIterator<TEvaluate<S>> :
  T
// --------------------------------------------------------------------------
// Evaluate
// --------------------------------------------------------------------------
// prettier-ignore
export function EvaluateIntersectType<X extends TSchema, Y extends TSchema>(L: X, R: Y) {
  return Type.Extends(L, R, 
    Type.Extends(R, L, R, 
    Type.Extends(L, R, L, 
  Type.Never())), 
    Type.Extends(R, L, R, 
    Type.Never()))
}
// prettier-ignore
export function EvaluateIntersectRest<T extends TSchema[]>(T: [...T]): TEvaluateIntersectRest<T> {
  if(T.length >= 2) {
    const [L, R, ...Rest] = T
    return EvaluateIntersectRest([EvaluateIntersectType(L, R), ...Rest]) as any
  } else {
    return T as any
  }
}
export function EvaluateProperties<T extends TProperties>(properties: T) {
  return Object.getOwnPropertyNames(properties).reduce((acc, key) => {
    return { ...acc, [key]: Evaluate(properties[key]) }
  }, {} as TProperties)
}
export function EvaluateArray<T extends TSchema[] | undefined>(rest: T) {
  if (rest === undefined) return [] // for tuple items
  return rest.map((schema) => Evaluate(schema))
}
// prettier-ignore
export function Evaluate<T extends TSchema>(schema: T): TEvaluate<T> {
  return (
    TypeGuard.TIntersect(schema)     ? Type.Intersect(EvaluateIntersectRest(schema.allOf)) :
    TypeGuard.TUnion(schema)         ? Type.Union(EvaluateArray(schema.anyOf)) :
    TypeGuard.TAsyncIterator(schema) ? Type.AsyncIterator(Evaluate(schema.items)) :
    TypeGuard.TIterator(schema)      ? Type.Iterator(Evaluate(schema.items)) :
    TypeGuard.TObject(schema)        ? Type.Object(EvaluateProperties(schema.properties)) :
    TypeGuard.TConstructor(schema)   ? Type.Constructor(EvaluateArray(schema.parameters), Evaluate(schema.returns)) :
    TypeGuard.TFunction(schema)      ? Type.Function(EvaluateArray(schema.parameters), Evaluate(schema.returns)) :
    TypeGuard.TTuple(schema)         ? Type.Tuple(EvaluateArray(schema.items)) :
    TypeGuard.TArray(schema)         ? Type.Promise(Evaluate(schema.items)) :
    TypeGuard.TPromise(schema)       ? Type.Promise(Evaluate(schema.item)) :
    schema 
  ) as TEvaluate<T>
}


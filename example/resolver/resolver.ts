/*--------------------------------------------------------------------------

@sinclair/typebox/resolver

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

// -------------------------------------------------------------------------
// ReferenceResolver
// -------------------------------------------------------------------------
export namespace ReferenceResolver {
  function* Intersect(schema: Types.TIntersect): IterableIterator<Types.TSchema> {
    for (const inner of schema.allOf) yield* Visit(inner)
  }
  function* Union(schema: Types.TUnion): IterableIterator<Types.TSchema> {
    for (const inner of schema.anyOf) yield* Visit(inner)
  }
  function* Constructor(schema: Types.TConstructor) {
    for (const inner of schema.parameters) {
      yield* Visit(inner)
    }
    yield* Visit(schema.returns)
  }
  function* Function(schema: Types.TFunction) {
    for (const inner of schema.parameters) {
      yield* Visit(inner)
    }
    yield* Visit(schema.returns)
  }
  function* Object(schema: Types.TObject): IterableIterator<Types.TSchema> {
    for (const key of globalThis.Object.keys(schema.properties)) yield* Visit(schema.properties[key])
  }
  function* Record(schema: Types.TRecord): IterableIterator<Types.TSchema> {
    const propertyKey = globalThis.Object.getOwnPropertyNames(schema.patternProperties)[0]
    yield* Visit(schema.patternProperties[propertyKey])
  }
  function* Array(schema: Types.TArray): IterableIterator<Types.TSchema> {
    return yield* Visit(schema.items)
  }
  function* Promise(schema: Types.TPromise): IterableIterator<Types.TSchema> {
    return yield* Visit(schema.item)
  }
  function* Ref(schema: Types.TRef): IterableIterator<Types.TSchema> {
    const reference = Types.ReferenceRegistry.DerefOne(schema)
    yield reference
    yield* Visit(reference)
  }
  function* Visit(schema: Types.TSchema): IterableIterator<Types.TSchema> {
    if (Types.TypeGuard.TRef(schema)) return yield* Ref(schema)
    if (Types.TypeGuard.TConstructor(schema)) return yield* Constructor(schema)
    if (Types.TypeGuard.TFunction(schema)) return yield* Function(schema)
    if (Types.TypeGuard.TIntersect(schema)) return yield* Intersect(schema)
    if (Types.TypeGuard.TRecord(schema)) return yield* Record(schema)
    if (Types.TypeGuard.TObject(schema)) return yield* Object(schema)
    if (Types.TypeGuard.TArray(schema)) return yield* Array(schema)
    if (Types.TypeGuard.TPromise(schema)) return yield* Promise(schema)
    if (Types.TypeGuard.TUnion(schema)) return yield* Union(schema)
  }
  /** Resolves direct or indirect references made by the given schema */
  export function Resolve<T extends Types.TSchema>(schema: T): IterableIterator<Types.TSchema> {
    return Visit(schema)
  }
}

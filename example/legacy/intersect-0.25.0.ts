/*--------------------------------------------------------------------------

@sinclair/typebox/legacy

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

import { TObject, ObjectOptions, Modifier, Kind, TSchema, Static } from '@sinclair/typebox'

export type IntersectLegacyReduce<I extends unknown, T extends readonly any[]> = T extends [infer A, ...infer B] ? IntersectLegacyReduce<I & A, B> : I extends object ? I : {}
export type IntersectLegacyEvaluate<T extends readonly TObject[], P extends unknown[]> = { [K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : never }
export type IntersectLegacyProperties<T extends readonly TObject[]> = {
  [K in keyof T]: T[K] extends TObject<infer P> ? P : {}
}
export interface TIntersectLegacy<T extends TObject[] = TObject[]> extends TObject {
  static: IntersectLegacyReduce<unknown, IntersectLegacyEvaluate<T, this['params']>>
  properties: IntersectLegacyReduce<unknown, IntersectLegacyProperties<T>>
}

/** `Legacy` Creates a legacy intersect type. */
export function IntersectLegacy<T extends TObject[]>(objects: [...T], options: ObjectOptions = {}): TIntersectLegacy<T> {
  const isOptional = (schema: TSchema) => (schema[Modifier] && schema[Modifier] === 'Optional') || schema[Modifier] === 'ReadonlyOptional'
  const [required, optional] = [new Set<string>(), new Set<string>()]
  for (const object of objects) {
    for (const [key, schema] of Object.entries(object.properties)) {
      if (isOptional(schema)) optional.add(key)
    }
  }
  for (const object of objects) {
    for (const key of Object.keys(object.properties)) {
      if (!optional.has(key)) required.add(key)
    }
  }
  const properties = {} as Record<string, any>
  for (const object of objects) {
    for (const [key, schema] of Object.entries(object.properties)) {
      properties[key] = properties[key] === undefined ? schema : { [Kind]: 'Union', anyOf: [properties[key], { ...schema }] }
    }
  }
  if (required.size > 0) {
    return { ...options, [Kind]: 'Object', type: 'object', properties, required: [...required] } as any
  } else {
    return { ...options, [Kind]: 'Object', type: 'object', properties } as any
  }
}

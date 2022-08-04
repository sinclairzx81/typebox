/*--------------------------------------------------------------------------

@sinclair/typebox/conditional

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import * as Types from '../typebox'
import { Structural, StructuralResult } from './structural'
import { TypeGuard } from '../guard/index'

// ------------------------------------------------------------------------
// Extends
// ------------------------------------------------------------------------

export type TExtends<L extends Types.TSchema, R extends Types.TSchema, T extends Types.TSchema, U extends Types.TSchema> = Types.Static<L> extends Types.Static<R> ? T : U

// ------------------------------------------------------------------------
// Exclude
// ------------------------------------------------------------------------

export interface TExclude<T extends Types.TUnion, U extends Types.TUnion> extends Types.TUnion<any[]> {
  static: Exclude<Types.Static<T, this['params']>, Types.Static<U, this['params']>>
}

// ------------------------------------------------------------------------
// Extract
// ------------------------------------------------------------------------

export interface TExtract<T extends Types.TSchema, U extends Types.TUnion> extends Types.TUnion<any[]> {
  static: Extract<Types.Static<T, this['params']>, Types.Static<U, this['params']>>
}

/** Conditional Types */
export namespace Conditional {
  /** (Experimental) Creates a conditional expression type */
  export function Extends<L extends Types.TSchema, R extends Types.TSchema, T extends Types.TSchema, U extends Types.TSchema>(left: L, right: R, ok: T, fail: U): TExtends<L, R, T, U> {
    switch (Structural.Check(left, right)) {
      case StructuralResult.Union:
        return Types.Type.Union([Clone(ok), Clone(fail)]) as any as TExtends<L, R, T, U>
      case StructuralResult.True:
        return Clone(ok)
      case StructuralResult.False:
        return Clone(fail)
    }
  }

  /** (Experimental) Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers. */
  export function Exclude<T extends Types.TUnion, U extends Types.TUnion>(unionType: T, excludedMembers: U, options: Types.SchemaOptions = {}): TExclude<T, U> {
    const anyOf = unionType.anyOf
      .filter((schema) => {
        const check = Structural.Check(schema, excludedMembers)
        return !(check === StructuralResult.True || check === StructuralResult.Union)
      })
      .map((schema) => Clone(schema))
    return { ...options, [Types.Kind]: 'Union', anyOf } as any
  }

  /** (Experimental) Constructs a type by extracting from Type all union members that are assignable to Union. */
  export function Extract<T extends Types.TSchema, U extends Types.TUnion>(type: T, union: U, options: Types.SchemaOptions = {}): TExtract<T, U> {
    if (TypeGuard.TUnion(type)) {
      const anyOf = type.anyOf.filter((schema: Types.TSchema) => Structural.Check(schema, union) === StructuralResult.True).map((schema: Types.TSchema) => Clone(schema))
      return { ...options, [Types.Kind]: 'Union', anyOf } as any
    } else {
      const anyOf = union.anyOf.filter((schema) => Structural.Check(type, schema) === StructuralResult.True).map((schema) => Clone(schema))
      return { ...options, [Types.Kind]: 'Union', anyOf } as any
    }
  }

  function Clone(value: any): any {
    const isObject = (object: any): object is Record<string | symbol, any> => typeof object === 'object' && object !== null && !Array.isArray(object)
    const isArray = (object: any): object is any[] => typeof object === 'object' && object !== null && Array.isArray(object)
    if (isObject(value)) {
      return Object.keys(value).reduce(
        (acc, key) => ({
          ...acc,
          [key]: Clone(value[key]),
        }),
        Object.getOwnPropertySymbols(value).reduce(
          (acc, key) => ({
            ...acc,
            [key]: Clone(value[key]),
          }),
          {},
        ),
      )
    } else if (isArray(value)) {
      return value.map((item: any) => Clone(item))
    } else {
      return value
    }
  }
}

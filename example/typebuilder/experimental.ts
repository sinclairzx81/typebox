
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
import { Value } from '@sinclair/typebox/value'

// -------------------------------------------------------------------------------------
// TReadonlyObject
// -------------------------------------------------------------------------------------
export type TReadonlyArray<T extends Types.TSchema[]> = Types.Assert<{ [K in keyof T]: TReadonlyObject<Types.Assert<T[K], Types.TSchema>> }, Types.TSchema[]>
// prettier-ignore
export type TReadonlyProperties<T extends Types.TProperties> = Types.Evaluate<Types.Assert<{
  [K in keyof T]: 
    T[K] extends Types.TReadonlyOptional<infer U> ? Types.TReadonlyOptional<U> : 
    T[K] extends Types.TReadonly<infer U>         ? Types.TReadonly<U> : 
    T[K] extends Types.TOptional<infer U>         ? Types.TReadonlyOptional<U> : 
    Types.TReadonly<T[K]>
}, Types.TProperties>>
// prettier-ignore
export type TReadonlyObject<T extends Types.TSchema> = 
  T extends Types.TIntersect<infer S> ? Types.TIntersect<TReadonlyArray<S>> : 
  T extends Types.TUnion<infer S>     ? Types.TUnion<TReadonlyArray<S>> : 
  T extends Types.TObject<infer S>    ? Types.TObject<TReadonlyProperties<S>> : 
  Types.TReadonly<T>

// -------------------------------------------------------------------------------------
// TUnionEnum
// -------------------------------------------------------------------------------------
export interface TUnionEnum<T extends (string | number)[]> extends Types.TSchema {
  [Types.Kind]: 'UnionEnum'
  static: T[number]
  enum: T
}
// -------------------------------------------------------------------------------------
// UnionOneOf
// -------------------------------------------------------------------------------------
export interface UnionOneOf<T extends Types.TSchema[]> extends Types.TSchema {
  [Types.Kind]: 'UnionOneOf'
  static: { [K in keyof T]: Types.Static<T[K]> }[number]
  oneOf: T
}
// -------------------------------------------------------------------------------------
// ExperimentalTypeBuilder
// -------------------------------------------------------------------------------------
export class ExperimentalTypeBuilder extends Types.ExtendedTypeBuilder {
  /** `[Experimental]` Remaps a Intersect, Union or Object as readonly */
  public ReadonlyObject<T extends Types.TSchema>(schema: T): TReadonlyObject<T> {
    function Apply(property: Types.TSchema): any {
      // prettier-ignore
      switch (property[Types.Modifier]) {
        case 'ReadonlyOptional': property[Types.Modifier] = 'ReadonlyOptional'; break
        case 'Readonly': property[Types.Modifier] = 'Readonly'; break
        case 'Optional': property[Types.Modifier] = 'ReadonlyOptional'; break
        default: property[Types.Modifier] = 'Readonly'; break
      }
      return property
    }
    // prettier-ignore
    return (Types.TypeGuard.TIntersect(schema) || Types.TypeGuard.TUnion(schema) || Types.TypeGuard.TObject(schema)) 
      ? Types.ObjectMap.Map<TReadonlyObject<T>>(schema, (schema) => {
        globalThis.Object.keys(schema.properties).forEach(key => Apply(schema.properties[key]))
      return schema
    }, {}) : Apply(schema)
  }
  /** `[Experimental]` Creates a Union type with a `enum` schema representation  */
  public UnionEnum<T extends (string | number)[]>(values: [...T], options: Types.SchemaOptions = {}) {
    function UnionEnumCheck(schema: TUnionEnum<(string | number)[]>, value: unknown) {
      return (typeof value === 'string' || typeof value === 'number') && schema.enum.includes(value)
    }
    if (!Types.TypeRegistry.Has('UnionEnum')) Types.TypeRegistry.Set('UnionEnum', UnionEnumCheck)
    return { ...options, [Types.Kind]: 'UnionEnum', enum: values } as TUnionEnum<T>
  }
  /** `[Experimental]` Creates a Union type with a `oneOf` schema representation */
  public UnionOneOf<T extends Types.TSchema[]>(oneOf: [...T], options: Types.SchemaOptions = {}) {
    function UnionOneOfCheck(schema: UnionOneOf<Types.TSchema[]>, value: unknown) {
      return 1 === schema.oneOf.reduce((acc: number, schema: any) => (Value.Check(schema, value) ? acc + 1 : acc), 0)
    }
    if (!Types.TypeRegistry.Has('UnionOneOf')) Types.TypeRegistry.Set('UnionOneOf', UnionOneOfCheck)
    return { ...options, [Types.Kind]: 'UnionOneOf', oneOf } as UnionOneOf<T>
  }
}

export const Type = new ExperimentalTypeBuilder()
import { Kind, TSchema, SchemaOptions, IntersectReduce, IntersectEvaluate } from '@sinclair/typebox'
import { Custom } from '@sinclair/typebox/custom'
import { Value } from '@sinclair/typebox/value'

export interface IntersectAllOfOptions extends SchemaOptions {
  unevaluatedProperties?: boolean
}

export interface IntersectAllOf<T extends TSchema[]> extends TSchema, IntersectAllOfOptions {
  [Kind]: 'IntersectAllOf'
  static: IntersectReduce<unknown, IntersectEvaluate<T, []>>
  allOf: T
}

/** Creates a Intersect type with a allOf  schema representation */
export function IntersectAllOf<T extends TSchema[]>(allOf: [...T], options: IntersectAllOfOptions = {}) {
  if (!Custom.Has('IntersectAllOf'))
    Custom.Set('IntersectAllOf', (schema: { allOf: TSchema[] }, value) => {
      return schema.allOf.every((schema) => Value.Check(schema, value))
    })
  return { ...options, [Kind]: 'IntersectAllOf', allOf } as IntersectAllOf<T>
}

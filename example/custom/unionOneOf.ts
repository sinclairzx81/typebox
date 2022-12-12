import { Kind, TSchema, SchemaOptions, Static } from '@sinclair/typebox'
import { Custom } from '@sinclair/typebox/custom'
import { Value } from '@sinclair/typebox/value'

export interface UnionOneOf<T extends TSchema[]> extends TSchema {
  [Kind]: 'UnionOneOf'
  static: { [K in keyof T]: Static<T[K]> }[number]
  oneOf: T
}

/** Creates a Union type with a oneOf schema representation */
export function UnionOneOf<T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) {
  if (!Custom.Has('UnionOneOf'))
    Custom.Set('UnionOneOf', (schema: { oneOf: TSchema[] }, value) => {
      return 1 === schema.oneOf.reduce((acc: number, schema: any) => (Value.Check(schema, value) ? acc + 1 : acc), 0)
    })
  return { [Kind]: 'UnionOneOf', oneOf } as UnionOneOf<T>
}

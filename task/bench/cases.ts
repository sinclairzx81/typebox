import { Type, TSchema } from 'npm:@sinclair/typebox'
import { Value } from 'npm:@sinclair/typebox/value'

export const Cases = {
  Boolean: () => Type.Boolean(),
  Number: () => Type.Number(),
  String: () => Type.String(),
  Null: () => Type.Null(),
  Literal_String: () => Type.Literal('hello'),
  Literal_Number: () => Type.Literal(1234),
  Literal_Boolean: () => Type.Literal(true),
  Pattern: () => Type.String({ pattern: 'foo', default: 'foo' }),

  Object_Open: () => Type.Object({
    number: Type.Number(),
    negNumber: Type.Number(),
    maxNumber: Type.Number(),
    string: Type.String(),
    longString: Type.String(),
    boolean: Type.Boolean(),
    deeplyNested: Type.Object({
      foo: Type.String(),
      num: Type.Number(),
      bool: Type.Boolean(),
    }),
  }),
  Object_Close: () => Type.Object(Cases.Object_Open().properties, {
    additionalProperties: false,
  }),
  Object_Vector3: () => Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number(),
  }),
  Object_Basis3: () => Type.Object({
    x: Cases.Object_Vector3(),
    y: Cases.Object_Vector3(),
    z: Cases.Object_Vector3(),
  }),
  Intersect_And: () => Type.Intersect([
    Type.Number(),
    Type.Number(),
    Type.Literal(1),
  ], { default: 1 }),
  Intersect_Structural: () => Type.Intersect([
    Type.Object({ a: Type.Number(), b: Type.Number() }),
    Type.Object({ c: Type.Number(), d: Type.Number() }),
    Type.Object({ e: Type.Number(), f: Type.Number() }),
  ], { default: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } }),

  Union_Or: () => Type.Union([
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3),
    Type.Literal(4),
  ], { default: 4 }),

  Union_Structural: () => Type.Union([
    Type.Object({ a: Type.Literal(1), b: Type.Literal(2) }),
    Type.Object({ c: Type.Literal(3), d: Type.Literal(4) }),
  ], { default: { c: 3, d: 4 } }),

  Tuple_Values: () => Type.Tuple([
    Type.String(),
    Type.Number(),
    Type.Boolean(),
  ]),
  Tuple_Objects: () => Type.Tuple([
    Cases.Object_Open(),
    Cases.Object_Open(),
    Cases.Object_Open(),
  ]),
  Array_Numbers_4: () => Type.Array(Type.Number(), { minItems: 4 }),
  Array_Numbers_8: () => Type.Array(Type.Number(), { minItems: 8 }),
  Array_Numbers_16: () => Type.Array(Type.Number(), { minItems: 16 }),
  Array_Objects_Open: () => Type.Array(Cases.Object_Open(), { minItems: 4 }),
  Array_Objects_Close: () => Type.Array(Cases.Object_Close(), { minItems: 4 }),
} as const
// ------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------
export const Tests = Object.getOwnPropertyNames(Cases).reduce<{
  name: string
  type: TSchema,
  value: unknown
}[]>((result, name) => {
  const factory = Cases[name as never] as () => TSchema
  const type = factory()
  const value = Value.Create(type)
  return [...result, { name, type, value }]
}, [] as {
  name: string
  type: TSchema,
  value: unknown
}[])
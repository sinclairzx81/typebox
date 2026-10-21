import { Type, type TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

// ------------------------------------------------------------------
// StructuralCases
// ------------------------------------------------------------------
export const StructuralCases = {
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
  Object_Close: () => Type.Object(StructuralCases.Object_Open().properties, {
    additionalProperties: false,
  }),
  Object_Vector3: () => Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number(),
  }),
  Object_Basis3: () => Type.Object({
    x: StructuralCases.Object_Vector3(),
    y: StructuralCases.Object_Vector3(),
    z: StructuralCases.Object_Vector3(),
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
    StructuralCases.Object_Open(),
    StructuralCases.Object_Open(),
    StructuralCases.Object_Open(),
  ]),
  Array_Numbers_4: () => Type.Array(Type.Number(), { minItems: 4 }),
  Array_Numbers_8: () => Type.Array(Type.Number(), { minItems: 8 }),
  Array_Numbers_16: () => Type.Array(Type.Number(), { minItems: 16 }),
  Array_Objects_Open: () => Type.Array(StructuralCases.Object_Open(), { minItems: 4 }),
  Array_Objects_Close: () => Type.Array(StructuralCases.Object_Close(), { minItems: 4 }),
} as const

// ------------------------------------------------------------------
// StructuralTests
// ------------------------------------------------------------------
export const StructuralTests = () => Object.getOwnPropertyNames(StructuralCases).reduce<{
  name: string
  type: TSchema,
  value: unknown
}[]>((result, name) => {
  const factory = StructuralCases[name as keyof typeof StructuralCases]
  const type = factory()
  const value = Value.Create(type)
  return [...result, { name, type, value }]
}, [] as {
  name: string
  type: TSchema,
  value: unknown
}[])
// ------------------------------------------------------------------
// FormatCases
// ------------------------------------------------------------------
export const FormatCases = [
  { name: 'DateTime', format: 'date-time', value: '2024-01-02T12:34:56Z' },
  { name: 'Date', format: 'date', value: '2024-01-02' },
  { name: 'Duration', format: 'duration', value: 'P1DT2H3M4S' },
  { name: 'Email', format: 'email', value: 'user@example.com' },
  { name: 'Hostname', format: 'hostname', value: 'example.com' },
  { name: 'IdnEmail', format: 'idn-email', value: 'user@bücher.example' },
  { name: 'IdnHostname', format: 'idn-hostname', value: 'bücher.example' },
  { name: 'IPv4', format: 'ipv4', value: '192.168.0.1' },
  { name: 'IPv6', format: 'ipv6', value: '2001:db8::1' },
  { name: 'IriReference', format: 'iri-reference', value: 'https://例え.テスト/道?q=値' },
  { name: 'Iri', format: 'iri', value: 'https://例え.テスト/道?q=値' },
  { name: 'JsonPointerUriFragment', format: 'json-pointer-uri-fragment', value: '#/a~1b' },
  { name: 'JsonPointer', format: 'json-pointer', value: '/foo/bar' },
  { name: 'Regex', format: 'regex', value: '^[a-z]+$' },
  { name: 'RelativeJsonPointer', format: 'relative-json-pointer', value: '1/foo' },
  { name: 'Time', format: 'time', value: '12:34:56Z' },
  { name: 'UriReference', format: 'uri-reference', value: 'https://example.com/a?b=c#d' },
  { name: 'UriTemplate', format: 'uri-template', value: 'https://example.com/{id}' },
  { name: 'Uri', format: 'uri', value: 'https://example.com/a?b=c#d' },
  { name: 'Url', format: 'url', value: 'https://example.com/a?b=c#d' },
  { name: 'Uuid', format: 'uuid', value: '550e8400-e29b-41d4-a716-446655440000' },
] as const

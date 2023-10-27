import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValueGuard } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests

function Parse<T extends TSchema>(schema: T, value: unknown): Static<T> {
  const withDefaults = Value.Default(schema, value)
  const valid = Value.Check(schema, withDefaults)
  if (!valid) throw new Error(Value.Errors(schema, withDefaults).First()!.message)
  return withDefaults
}

const A = Parse(
  Type.Object({
    // const A = { x: 1, y: 0 }
    x: Type.Number({ default: 0 }),
    y: Type.Number({ default: 0 }),
  }),
  { x: 1 },
)
console.log(A)
// const T = Type.Record(Type.Number(), Type.String({ default: 1 }), {
//   additionalProperties: Type.Any({ default: 1000 }),
// })

// export const Loose = Type.Object({
//   number: Type.Number(),
//   negNumber: Type.Number(),
//   maxNumber: Type.Number(),
//   string: Type.String(),
//   longString: Type.String(),
//   boolean: Type.Boolean(),
//   deeplyNested: Type.Object({
//     foo: Type.String(),
//     num: Type.Number(),
//     bool: Type.Boolean(),
//   }),
// })

// const C = TypeCompiler.Compile(Loose)

// const A = Value.Clone(new Map())

// console.log(A)

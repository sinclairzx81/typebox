import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValueGuard } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, KeyResolver } from '@sinclair/typebox'
import { Run } from './benchmark'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests

const T = Type.Intersect([Type.Number(), Type.Number()])
const R = Value.Clean(T, { u: null, x: 1 })
console.log(R)
// const T = Type.Intersect([
//   Type.Object({ x: Type.Number() }),
//   Type.Object({ y: Type.Number() })
// ], {
//   unevaluatedProperties: Type.Union([
//     Type.Number(),
//     Type.Null()
//   ])
// })

// const T = Type.Object(
//   {
//     number: Type.Number({ default: 1 }),
//     negNumber: Type.Number({ default: 1 }),
//     maxNumber: Type.Number({ default: 3 }),
//     string: Type.String({ default: 5 }),
//     longString: Type.String(),
//     boolean: Type.Boolean(),
//     deeplyNested: Type.Object({
//       foo: Type.String({ default: 2 }),
//       num: Type.Number(),
//       bool: Type.Boolean(),
//     }),
//   },
//   {
//     additionalProperties: Type.Any(),
//   },
// )

// const A = Value.Default(T, {})
// console.log(A)

// console.log(Value.Transmute({}, {}))

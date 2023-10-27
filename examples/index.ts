import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValueGuard } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'
import { Run } from './benchmark'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests

export const T = Type.Object({
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
})
const A = Value.Create(T)

const R = Run(
  () => {
    Value.Strict(T, A)
  },
  {
    iterations: 1_000_000,
  },
)

console.log(R)

// const C = TypeCompiler.Compile(Loose)

// const A = Value.Clone(new Map())

// console.log(A)

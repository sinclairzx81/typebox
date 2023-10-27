import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValueGuard } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, KeyResolver, TObject } from '@sinclair/typebox'
import { Run } from './benchmark'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests

function ParseEnv<T extends TObject>(schema: T, value: unknown = process.env): Static<T> {
  const converted = Value.Convert(schema, value)
  const defaulted = Value.Default(schema, converted)
  const checked = Value.Check(schema, defaulted)
  return checked
    ? (Value.Clean(schema, defaulted) as Static<T>)
    : (() => {
        const first = Value.Errors(schema, defaulted).First()!
        throw new Error(`${first.message} ${first.path}. Value is ${first.value}`)
      })()
}
console.log(process.env)

const R = Run(
  () => {
    const E = ParseEnv(
      Type.Object({
        PROCESSOR_ARCHITECTURE: Type.String(),
        PROCESSOR_IDENTIFIER: Type.String(),
        PROCESSOR_LEVEL: Type.Number(),
        PROCESSOR_REVISION: Type.Number(),
      }),
    )
  },
  {
    iterations: 2000,
  },
)

console.log(R)

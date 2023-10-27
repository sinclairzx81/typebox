import { Type, Static, TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

/** User defined parse function */
export function Parse<T extends TSchema>(schema: T, value: unknown): Static<T> {
  const converted = Value.Convert(schema, value)
  const defaulted = Value.Default(schema, converted)
  const checked = Value.Check(schema, defaulted)
  return checked ? Value.Clean(schema, defaulted) as Static<T> : (() => {
    const first = Value.Errors(schema, defaulted).First()!
    throw new Error(`${first.message} ${first.path}. Value is ${first.value}`)
  })()
}

// Parse some environment variables
const environment = Parse(Type.Object({
  PROCESSOR_ARCHITECTURE: Type.String(),
  PROCESSOR_IDENTIFIER:  Type.String(),
  PROCESSOR_LEVEL: Type.Number(),
  PROCESSOR_REVISION: Type.Number(),
}), process.env)

console.log(environment)

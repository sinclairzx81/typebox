import { Type, StaticDecode, TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

/** User defined parse function */
export function Parse<T extends TSchema>(schema: T, value: unknown): StaticDecode<T> {
  const converted = Value.Convert(schema, value)
  const defaulted = Value.Default(schema, converted)
  const decoded = Value.Decode(schema, defaulted)
  return Value.Clean(schema, decoded)
}

// Parse some environment variables
const environment = Parse(Type.Object({
  PROCESSOR_ARCHITECTURE: Type.String(),
  PROCESSOR_IDENTIFIER:  Type.String(),
  PROCESSOR_LEVEL: Type.Number(),
  PROCESSOR_REVISION: Type.Number(),
}), process.env)

console.log(environment)

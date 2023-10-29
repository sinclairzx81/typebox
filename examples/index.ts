import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValueGuard } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, KeyResolver, TObject, TypeRegistry, StaticDecode } from '@sinclair/typebox'
import { Benchmark } from './benchmark'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests - Done

export function Parse<T extends TSchema>(schema: T, value: unknown): StaticDecode<T> {
  const converted = Value.Convert(schema, value)
  const defaulted = Value.Default(schema, converted)
  const decoded = Value.Decode(schema, defaulted)
  return Value.Clean(schema, decoded)
}

const DateNumber = Type.Transform(Type.Number())
  .Decode((value) => new Date(value))
  .Encode((value) => value.getTime())

const R = Parse(
  Type.Object({
    PROCESSOR_ARCHITECTURE: Type.String(),
    PROCESSOR_IDENTIFIER: Type.String(),
    PROCESSOR_LEVEL: DateNumber,
    PROCESSOR_REVISION: Type.Number(),
  }),
  process.env,
)

console.log(R)

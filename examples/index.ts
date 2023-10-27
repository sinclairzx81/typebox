import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests

const T = Type.Record(Type.Number(), Type.String({ default: 1 }), {
  additionalProperties: Type.Any({ default: 1000 }),
})

const R = Value.Default(T, { y: 2, z: undefined })

console.log(R)

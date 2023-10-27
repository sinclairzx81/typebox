import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests

const T = Type.Record(Type.Number(), Type.String({ default: 1 }), {
  additionalProperties: Type.Any({ default: 1000 }),
})

export const Loose = Type.Object({
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

const C = TypeCompiler.Compile(Loose)

const A = Value.Create(Loose)

let S = Date.now()
for (let i = 0; i < 1_000_000; i++) {
  Value.Clean(Loose, A)
}
console.log(Date.now() - S)

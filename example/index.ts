import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Evaluate } from '@sinclair/typebox'

const T = Type.Composite([
  Type.Object({
    a: Type.Literal(1),
  }),
  Type.Object({
    a: Type.Number(),
  }),
])

const M = Type.Partial(T)

type T = Static<typeof M>

console.log(M)

import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Evaluate } from '@sinclair/typebox'

const A = Type.Object({ a: Type.Number() })
const B = Type.Partial(Type.Object({ b: Type.Number() }))
const C = Type.Object({ b: Type.String() })
const P = Type.Composite([A, B, C], { additionalProperties: false })

type T = Static<typeof P>

console.log(P)

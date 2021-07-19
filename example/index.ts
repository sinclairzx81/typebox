import { Type, Static } from '@sinclair/typebox'

const A = Type.Object({ a: Type.Number() })
const B = Type.Object({ b: Type.Number() })
const C = Type.Record(Type.Boolean())
const D = Type.Intersect([A, B, C])

type T = Static<typeof D>

function x(t: T) {
    t.aa = true
}
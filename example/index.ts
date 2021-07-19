import { Type, Static } from '@sinclair/typebox'

const A = Type.Object({ a: Type.Readonly(Type.Number()) })
const B = Type.Object({ b: Type.String() })
const C = Type.Record(Type.Boolean())
const D = Type.Intersect([A, B, C])

type T = Static<typeof D>

console.log(D)

function x(t: T) {
    t.aa = true
}
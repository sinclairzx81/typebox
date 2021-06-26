import { Type, Static } from './src/typebox'

const A = Type.Object({
    a: Type.Number(),
    b: Type.Number()
})

const B = Type.Object({
    c: Type.Number(),
    d: Type.Number()
}, { additionalProperties: false })

const C = Type.Intersect([A, B], { additionalProperties: false })

console.log(B)

type X = Static<typeof C>
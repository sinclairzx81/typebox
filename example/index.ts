import { Type, Static } from '@sinclair/typebox'

const A = Type.Object({
    x: Type.Number()
})
const B = Type.Object({
    y: Type.Optional(Type.String())
})

const T = Type.Required(Type.Intersect([A, B]))

type T = Static<typeof T>

console.log(T)

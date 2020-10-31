import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const U0 = Type.Object({
    a: Type.String(),
    b: Type.Number()
})

const U1 = Type.Object({
    c: Type.Boolean()
})

const T0 = Type.Intersect([U0, U1])
const F0 = (arg: Static<typeof T0>) => {}
F0({
    a: 'string',
    b: 1,
    c: true
})


import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Object({
    a: Type.Number(),
    b: Type.String(),
    c: Type.Boolean(),
    d: Type.Object({
        e: Type.Array(Type.String()),
    }),
    e: Type.Dict(Type.String()),
})

const F0 = (arg: Static<typeof T0>) => {}

F0({
    a: 1,
    b: '',
    c: true,
    d: { 
        e: [''] 
    },
    e: { a: '' }
})


import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const U0 = Type.Object({
    a: Type.ReadonlyOptional(Type.String()),
    b: Type.Readonly(Type.String()),
    c: Type.Optional(Type.String()),
    d: Type.String(),
})

const T0 = Type.KeyOf(U0)

const F0 = (arg: Static<typeof T0>) => {}
F0('a')
F0('c')
F0('c')
F0('d')

const U1 = Type.Object({
    a: Type.ReadonlyOptional(Type.String()),
    b: Type.Readonly(Type.String()),
    c: Type.Optional(Type.String()),
    d: Type.String(),
})

const T1 = Type.Object({
    k: Type.KeyOf(U1)
})

const F1 = (arg: Static<typeof T1>) => {}
F1({ k: 'a'})
F1({ k: 'b'})
F1({ k: 'c'})
F1({ k: 'd'})

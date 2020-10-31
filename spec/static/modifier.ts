import { Type, Static } from '@sinclair/typebox'

const T0 = Type.Object({
    a: Type.Optional(Type.Number()),
    b: Type.Readonly(Type.String()),
    c: Type.ReadonlyOptional(Type.Boolean())
})
const F0 = (arg: Static<typeof T0>) => {}

F0({
    b: 'hello',
    c: false // note: can't trigger the readonly optional case.
})

F0({
    a: 1,
    b: 'hello',
    c: false // note: can't trigger the readonly optional case.
})


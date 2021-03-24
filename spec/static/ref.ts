import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Object({
    a: Type.Number(),
    b: Type.String(),
}, {
    $id: 'T0'
})

const R0 = Type.Ref(T0)

const F0 = (arg: Static<typeof R0>) => {}

F0({
    a: 3,
    b: ''
})

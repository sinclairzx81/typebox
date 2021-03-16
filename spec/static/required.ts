import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Required(Type.Object({
    x: Type.Optional(Type.Number()),
    y: Type.Optional(Type.Number()),
    z: Type.Optional(Type.Number())
}))

const F0 = (arg: Static<typeof T0>) => {}
F0({ x: 1, y: 1, z: 1 })


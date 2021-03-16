import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Omit(Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
}), ['z'])

const F0 = (arg: Static<typeof T0>) => {}
F0({ x: 1, y: 1 })

import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Pick(Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
}), ['x', 'y'])

const F0 = (arg: Static<typeof T0>) => {}
F0({ x: 1, y: 1 })
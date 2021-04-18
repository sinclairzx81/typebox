import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Function([], Type.Boolean())
const F0 = (arg: Static<typeof T0>) => {}
F0(() => true)

const T1 = Type.Function([Type.Integer(), Type.Integer()], Type.String())
const F1 = (arg: Static<typeof T1>) => {}
F1((x: number, y: number) => "")

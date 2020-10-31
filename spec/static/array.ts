import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Array(Type.String())
const F0 = (arg: Static<typeof T0>) => {}
F0(['', ''])

// --------------------------------------------

const T1 = Type.Array(Type.Union([Type.String(), Type.Number()]))
const F1 = (arg: Static<typeof T1>) => {}
F1(['', 1])

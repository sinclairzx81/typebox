import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Literal('string')
const F0 = (arg: Static<typeof T0>) => {}
F0('string')

// --------------------------------------------

const T1 = Type.Literal(123)
const F1 = (arg: Static<typeof T1>) => {}
F1(123)

// --------------------------------------------

const T2 = Type.Literal(true)
const F2 = (arg: Static<typeof T2>) => {}
F2(true)
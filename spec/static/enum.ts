import { Type, Static } from '@sinclair/typebox'

// -------------------------------------

enum K0 { A, B, C }
const T0 = Type.Enum(K0)
const F0 = (arg: Static<typeof T0>) => {}
F0(K0.A)
F0(K0.B)
F0(K0.C)

// -------------------------------------

enum K1 { A = '1', B = '2', C = '3' }
const T1 = Type.Enum(K1)
const F1 = (arg: Static<typeof T1>) => {}
F1(K1.A)
F1(K1.B)
F1(K1.C)


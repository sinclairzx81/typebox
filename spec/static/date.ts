import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Date()
const F0 = (arg: Static<typeof T0>) => { }
F0(new Date())


import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Tuple([Type.String(), Type.Boolean(), Type.Number()])
const F0 = (arg: Static<typeof T0>) => {}
F0(['', true, 1])


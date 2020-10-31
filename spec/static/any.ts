import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Any()
const F0 = (arg: Static<typeof T0>) => {}
F0('string')
F0(true)
F0({})
F0([0, 1, 2])
F0({})
import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Tuple([Type.Number(), Type.Number()])

const B0 = Type.Box('ns', { T0 })

const R0 = Type.Ref(B0, 'T0')

const F0 = (arg: Static<typeof R0>) => {}

F0([1, 2])


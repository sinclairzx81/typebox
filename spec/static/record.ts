import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Record(Type.Union([Type.String(), Type.Number()]))
const F0 = (arg: Static<typeof T0>) => {}
F0({
    'a': 'hello',
    'b': 'world',
    'c': 1
})


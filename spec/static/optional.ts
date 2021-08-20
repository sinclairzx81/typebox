import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Object({
    a: Type.Number(),
    b: Type.Optional(Type.Number())
})

const F0 = (arg: Static<typeof T0>) => { }

F0({
    a: 1,
    b: 1,
})

F0({
    a: 1
})

// ------------------------------------------------

const T1 = Type.Object({
    records: Type.Optional(Type.Record(Type.Number(), Type.String()))
})

const F1 = (arg: Static<typeof T1>) => { }

F1({
    records: {
        '0': 'hello',
        '1': 'world'
    }
})
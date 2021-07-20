import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Record(Type.String(), Type.Number())
const F0 = (arg: Static<typeof T0>) => {}
F0({
    'a': 1,
    'b': 2,
    'c': 3
})

// --------------------------------------------

const T1 = Type.Record(Type.Number(), Type.Number())
const F1 = (arg: Static<typeof T1>) => {}
F1({
    '0': 1,
    '1': 2,
    '2': 3
})

// --------------------------------------------

const K = Type.Union([
    Type.Literal('a'),
    Type.Literal('b'),
    Type.Literal('c'),
    Type.Literal(0),
    Type.Literal(1),
    Type.Literal(2),
])
const T2 = Type.Record(K, Type.Number())
const F2 = (arg: Static<typeof T2>) => {}
F2({
    'a': 1,
    'b': 2,
    'c': 3,
    0: 1,
    1: 2,
    2: 3
})
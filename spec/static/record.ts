import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Record(Type.String(), Type.Number())
const F0 = (arg: Static<typeof T0>) => { }
F0({
    'a': 1,
    'b': 2,
    'c': 3
})

// --------------------------------------------

const T1 = Type.Record(Type.Number(), Type.Number())
const F1 = (arg: Static<typeof T1>) => { }
F1({
    '0': 1,
    '1': 2,
    '2': 3
})

// --------------------------------------------

const K = Type.Object({
    a: Type.Literal('a'),
    b: Type.Literal('b'),
    c: Type.Literal('c'),
    d: Type.Literal(0),
    e: Type.Literal(1),
    f: Type.Literal(2),
})

const T2 = Type.Record(Type.KeyOf(K), Type.Number())
const F2 = (arg: Static<typeof T2>) => { }
F2({
    'a': 1,
    'b': 2,
    'c': 3,
    'd': 1,
    'e': 2,
    'f': 3
})
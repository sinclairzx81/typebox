import { Type, Static, TSchema } from '@sinclair/typebox';

// const K = Type.String()

// const K = Type.Number()

// const K = Type.Union([Type.Literal('A'), Type.Literal('B')])

// const K = Type.KeyOf(Type.Object({ A: Type.Number() }))

const K = Type.RegEx(/foobar[0-1]/)

const T = Type.Record(K, Type.String())

console.log(K)

console.log(T)




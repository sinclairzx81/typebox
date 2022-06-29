import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
    x: Type.Number(),
    y: Type.Number()
})

const K = Type.KeyOf(T)

const R = Type.Record(K, Type.String())

const C = Type.Constructor([], Type.String())

type C = Static<typeof C>

const U = Type.Uint8Array({ })

const A = Type.Pick(T, ['x'], {})

console.log(C)
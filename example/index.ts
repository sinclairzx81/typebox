import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
    x: Type.Number(),
    y: Type.Number()
})

const K = Type.KeyOf(T)

const R = Type.Record(K, Type.String())



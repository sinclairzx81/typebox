import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
    x: Type.String(),
    y: Type.Number(),
    z: Type.String()
}, { $id: 'T' })

const R = Type.Ref(T)

const K = Type.KeyOf(R)

type T = Static<typeof K>

console.log(K)


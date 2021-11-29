import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
    name:  Type.Optional(Type.String()),
    order: Type.Number()
}, { $id: 'T' })

const R = Type.Ref(T)

const P = Type.Omit(T, ['name'])

console.log(P)

type T = Static<typeof P>


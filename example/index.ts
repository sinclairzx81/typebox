import { Type, Static } from '@sinclair/typebox'

const Node = Type.Rec(Self => Type.Object({
    nodeId: Type.String(),
    nodes: Type.Array(Self)
}, { additionalProperties: false }), { $id: 'Node' })


const T = Type.Constructor([Type.String(), Type.String()], Type.Number())

type T = Static<typeof T>


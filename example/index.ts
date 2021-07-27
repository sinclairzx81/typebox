import { Type, Static } from '@sinclair/typebox'

const Node = Type.Rec(Self => Type.Object({
    nodeId: Type.String(),
    nodes: Type.Array(Self)
}, { additionalProperties: false }), { $id: 'Node' })





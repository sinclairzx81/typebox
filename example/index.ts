import { Type, Static } from '@sinclair/typebox'

type Node = Static<typeof Node>

const Node = Type.Rec(Self => Type.Object({
    id:    Type.String(),
    nodes: Type.Array(Self)
}))

function walk(node: Node) {
    for(const inner of node.nodes) {
        walk(inner as Node)
    }
}

import { Type, Static } from '@sinclair/typebox'

interface Element {
    elementId: string
    elements: Element[]
}

interface Node {
    nodeId: string
    nodes: Node[]
    element: Element
}

const Element = Type.Rec('Element', Self => ({
    elementId: Type.String(),
    elements: Type.Array(Self)
}), { additionalProperties: false })

const Node = Type.Rec('Node', Self => ({
    nodeId: Type.String(),
    nodes: Type.Array(Self)
}))

console.log(JSON.stringify(Node, null, 2))

// {
//     "$id": "Node",
//     "$recursiveAnchor": true,
//     "type": "object",
//     "properties": {
//       "nodeId": {
//         "type": "string"
//       },
//       "nodes": {
//         "type": "array",
//         "items": {
//           "$recursiveRef": "Node"
//         }
//       }
//     }
//   }



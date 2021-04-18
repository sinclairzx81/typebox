import { Type, Static, TObject, TProperties } from '@sinclair/typebox'

// -----------------------------------------------
// npm start to run example
// -----------------------------------------------

type Node = Static<typeof Node>
const Node = Type.Object({
    nodes: Type.Array(Type.Ref(() => Node))
}, { $id: 'Node' })

function test(node: Node) {
    
}




import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
    x: Type.Number(),
    y: Type.Number()
})

const K = Type.KeyOf(T)

const R = Type.Record(K, Type.String())




const Node = Type.Recursive(Node => Type.Object({  // const Node = {
    id:    Type.String(),                          //   $id: "Node",
    nodes: Type.Array(Node),                       //   type: "object",
}), { $id: 'Node' })                               //   properties: {
                                                   //     id: {
                                                   //       "type": "string"
                                                   //     },
                                                   //     nodes: {
                                                   //       type: "array",
                                                   //       items: {
                                                   //         $ref: "Node"
                                                   //       }
                                                   //     }
                                                   //   },
                                                   //   required: [
                                                   //     "id",
                                                   //     "nodes"
                                                   //   ]
                                                   // }

console.log(JSON.stringify(Node, null, 2))
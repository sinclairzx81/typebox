import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Rec", () => {

    it('Should validate recursive Node type', () => {
        const Node = Type.Rec('Node', Self => ({
            nodeId: Type.String(),
            nodes: Type.Array(Self)
        }), { additionalProperties: false })
        ok(Node, { id: '1', nodes: [] })
        ok(Node, {
            nodeId: '1',
            nodes: [
                { nodeId: '2', nodes: [] },
                { nodeId: '3', nodes: [] },
                { nodeId: '4', nodes: [] },
                { nodeId: '5', nodes: [] }
            ]
        })
    })
    
    it('Should not validate recursive Node type', () => {
        const Node = Type.Rec('Node', Self => ({
            nodeId: Type.String(),
            nodes: Type.Array(Self)
        }), { additionalProperties: false })
        fail(Node, {
            id: '1',
            nodes: [1, 2, 3, 4]
        })
    })

    // it('Should validate with JSON pointer references to sub schema', () => {
    //     const Element = Type.Rec('Element', Self => ({
    //         elementId: Type.String(),
    //         elements: Type.Array(Self)
    //     }), { additionalProperties: false })

    //     const Node = Type.Rec('Node', Self => ({
    //         nodeId: Type.String(),
    //         nodes: Type.Array(Self),
    //         element: Element
    //     }), { additionalProperties: false })

    //     ok(Node, {
    //         nodeId: '1',
    //         nodes: [
    //             { nodeId: '2', nodes: [] },
    //             { nodeId: '3', nodes: [] },
    //             { nodeId: '4', nodes: [] },
    //             { nodeId: '5', nodes: [] }
    //         ],
    //         element: {
    //             elementId: '1',
    //             elements: [{
    //                 elementId: '1',
    //                 elements: []
    //             }]
    //         }
    //     })
    // })
})

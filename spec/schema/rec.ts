import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Rec", () => {

    it('Should validate recursive Node type', () => {
        const Node = Type.Rec(Self => Type.Object({
            id: Type.String(),
            nodes: Type.Array(Self)
        }), 'Node')
        ok(Node, {
            id: '1',
            nodes: []
        })
        ok(Node, {
            id: '1',
            nodes: [
                { id: '2', nodes: [] },
                { id: '3', nodes: [] },
                { id: '4', nodes: [] },
                { id: '5', nodes: [] }
            ]
        })
    })

    it('Should not validate recursive Node type', () => {
        const Node = Type.Rec(Self => Type.Object({
            id: Type.String(),
            nodes: Type.Array(Self)
        }), 'Node')
        fail(Node, {
            id: '1',
            nodes: [1, 2, 3, 4]
        })
    })
    
})

import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Rec", () => {
    it('Should validate recursive node type', () => {
        const Node = Type.Rec(Self => Type.Object({
            id: Type.String(),
            nodes: Type.Array(Self)
        }))
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
        fail(Node, {
            id: '1',
            nodes: 'a string' // not assert on any
        })
    })
})

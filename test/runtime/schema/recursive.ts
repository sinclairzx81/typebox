import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/schema/Recursive', () => {
  it('Should validate recursive node type', () => {
    const Node = Type.Recursive((Self) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(Self),
      }),
    )
    ok(Node, {
      id: 'A',
      nodes: [
        { id: 'B', nodes: [] },
        { id: 'C', nodes: [] },
      ],
    })
  })

  it('Should validate wrapped recursive node type', () => {
    const Node = Type.Tuple([
      Type.Recursive((Self) =>
        Type.Object({
          id: Type.String(),
          nodes: Type.Array(Self),
        }),
      ),
    ])
    ok(Node, [
      {
        id: 'A',
        nodes: [
          { id: 'B', nodes: [] },
          { id: 'C', nodes: [] },
        ],
      },
    ])
  })

  it('Should not validate wrapped recursive node type with invalid id', () => {
    const Node = Type.Tuple([
      Type.Recursive((Self) =>
        Type.Object({
          id: Type.String(),
          nodes: Type.Array(Self),
        }),
      ),
    ])
    fail(Node, [
      {
        id: 'A',
        nodes: [
          { id: 1, nodes: [] },
          { id: 'C', nodes: [] },
        ],
      },
    ])
  })
})

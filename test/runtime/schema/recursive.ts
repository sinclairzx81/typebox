import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'
import { Assert } from '../assert/index'

describe('compiler-ajv/Recursive', () => {
  it('Should generate default ordinal $id if not specified', () => {
    const Node = Type.Recursive((Node) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(Node),
      }),
    )
    Assert.IsFalse(Node.$id === undefined)
  })
  it('Should override default ordinal $id if specified', () => {
    const Node = Type.Recursive(
      (Node) =>
        Type.Object({
          id: Type.String(),
          nodes: Type.Array(Node),
        }),
      { $id: 'Node' },
    )
    Assert.IsEqual(Node.$id === 'Node', true)
  })
  it('Should validate recursive node type', () => {
    const Node = Type.Recursive((This) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(This),
      }),
    )
    Ok(Node, {
      id: 'A',
      nodes: [
        { id: 'B', nodes: [] },
        { id: 'C', nodes: [] },
      ],
    })
  })
  it('Should validate wrapped recursive node type', () => {
    const Node = Type.Tuple([
      Type.Recursive((This) =>
        Type.Object({
          id: Type.String(),
          nodes: Type.Array(This),
        }),
      ),
    ])
    Ok(Node, [
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
      Type.Recursive((This) =>
        Type.Object({
          id: Type.String(),
          nodes: Type.Array(This),
        }),
      ),
    ])
    Fail(Node, [
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

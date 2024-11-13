import { Type } from '@sinclair/typebox'
import { Ok } from './validate'

describe('compiler/Unicode', () => {
  // ---------------------------------------------------------
  // Identifiers
  // ---------------------------------------------------------
  it('Should support unicode identifiers', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
      },
      {
        $id: '식별자',
      },
    )
    Ok(T, {
      x: 1,
      y: 2,
    })
  })
  it('Should support unicode identifier references', () => {
    const R = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
      },
      {
        $id: '식별자',
      },
    )
    const T = Type.Object({
      vector: Type.Ref(R.$id!),
    })
    Ok(
      T,
      {
        vector: {
          x: 1,
          y: 2,
        },
      },
      [R],
    )
  })
  it('Should support unicode identifier recursion', () => {
    const Node = Type.Recursive(
      (Node) =>
        Type.Object({
          id: Type.String(),
          nodes: Type.Array(Node),
        }),
      {
        $id: '식별자',
      },
    )
    Ok(Node, {
      id: 'A',
      nodes: [
        {
          id: 'B',
          nodes: [
            {
              id: 'C',
              nodes: [],
            },
          ],
        },
      ],
    })
  })
  // ---------------------------------------------------------
  // Properties
  // ---------------------------------------------------------
  it('Should support unicode properties', () => {
    const T = Type.Object({
      이름: Type.String(),
    })
    Ok(T, {
      이름: 'dave',
    })
  })
})

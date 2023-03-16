import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'
import { Assert } from '../assert/index'

describe('type/compiler/Ref', () => {
  it('Should should validate when referencing a type', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: Assert.nextId() },
    )
    const R = Type.Ref(T)
    Ok(
      R,
      {
        x: 1,
        y: 2,
        z: 3,
      },
      [T],
    )
  })

  it('Should not validate when passing invalid data', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: Assert.nextId() },
    )
    const R = Type.Ref(T)
    Fail(
      R,
      {
        x: 1,
        y: 2,
      },
      [T],
    )
  })

  it('Should de-reference object property schema', () => {
    const T = Type.Object(
      {
        name: Type.String(),
      },
      { $id: 'R' },
    )

    const R = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
        r: Type.Optional(Type.Ref(T)),
      },
      { $id: 'T' },
    )

    Ok(R, { x: 1, y: 2, z: 3 }, [T])
    Ok(R, { x: 1, y: 2, z: 3, r: { name: 'hello' } }, [T])
    Fail(R, { x: 1, y: 2, z: 3, r: { name: 1 } }, [T])
    Fail(R, { x: 1, y: 2, z: 3, r: {} }, [T])
  })

  it('Should reference recursive schema', () => {
    const T = Type.Recursive((Node) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(Node),
      }),
    )
    const R = Type.Ref(T)
    Ok(R, { id: '', nodes: [{ id: '', nodes: [] }] }, [T])
    Fail(R, { id: '', nodes: [{ id: 1, nodes: [] }] }, [T])
  })
})

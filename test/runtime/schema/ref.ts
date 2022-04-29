import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { Assert } from '../assert/index'

describe('type/schema/Ref', () => {
  it('Should should validate when referencing a type', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: 'T' },
    )
    const R = Type.Ref(T)
    ok(
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
      { $id: 'T' },
    )
    const R = Type.Ref(T)
    fail(
      R,
      {
        x: 1,
        y: 2,
      },
      [T],
    )
  })
  it('Should de-reference object property schema', () => {
    const R = Type.Object(
      {
        name: Type.String(),
      },
      { $id: 'R' },
    )

    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
        r: Type.Optional(Type.Ref(R)),
      },
      { $id: 'T' },
    )

    ok(T, { x: 1, y: 2, z: 3 }, [R])
    ok(T, { x: 1, y: 2, z: 3, r: { name: 'hello' } }, [R])
    fail(T, { x: 1, y: 2, z: 3, r: { name: 1 } }, [R])
    fail(T, { x: 1, y: 2, z: 3, r: {} }, [R])
  })
})

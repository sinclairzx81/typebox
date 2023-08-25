import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Ref', () => {
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
      { $id: 'T' },
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
    Ok(T, { x: 1, y: 2, z: 3 }, [R])
    Ok(T, { x: 1, y: 2, z: 3, r: { name: 'hello' } }, [R])
    Fail(T, { x: 1, y: 2, z: 3, r: { name: 1 } }, [R])
    Fail(T, { x: 1, y: 2, z: 3, r: {} }, [R])
  })
})

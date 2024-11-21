import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Ref', () => {
  // ----------------------------------------------------------------
  // Deprecated
  // ----------------------------------------------------------------
  it('Should validate for Ref(Schema)', () => {
    const T = Type.Number({ $id: 'T' })
    const R = Type.Ref(T)
    Ok(R, 1234, [T])
    Fail(R, 'hello', [T])
  })
  // ----------------------------------------------------------------
  // Standard
  // ----------------------------------------------------------------
  it('Should should validate when referencing a type', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: 'T' },
    )
    const R = Type.Ref(T.$id!)
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
    const R = Type.Ref(T.$id!)
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
        r: Type.Optional(Type.Ref(R.$id!)),
      },
      { $id: 'T' },
    )
    Ok(T, { x: 1, y: 2, z: 3 }, [R])
    Ok(T, { x: 1, y: 2, z: 3, r: { name: 'hello' } }, [R])
    Fail(T, { x: 1, y: 2, z: 3, r: { name: 1 } }, [R])
    Fail(T, { x: 1, y: 2, z: 3, r: {} }, [R])
  })
})

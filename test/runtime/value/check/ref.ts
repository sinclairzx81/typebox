import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Ref', () => {
  // ----------------------------------------------------------------
  // Deprecated
  // ----------------------------------------------------------------
  it('Should validate for Ref(Schema)', () => {
    const T = Type.Number({ $id: 'T' })
    const R = Type.Ref(T)
    Assert.IsTrue(Value.Check(T, [T], 1234))
    Assert.IsFalse(Value.Check(T, [T], 'hello'))
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
      { $id: Assert.NextId() },
    )
    const R = Type.Ref(T.$id!)
    Assert.IsEqual(
      Value.Check(R, [T], {
        x: 1,
        y: 2,
        z: 3,
      }),
      true,
    )
  })

  it('Should not validate when passing invalid data', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: Assert.NextId() },
    )
    const R = Type.Ref(T.$id!)
    Assert.IsEqual(
      Value.Check(R, [T], {
        x: 1,
        y: 2,
      }),
      false,
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
        r: Type.Optional(Type.Ref(T.$id!)),
      },
      { $id: 'T' },
    )
    Assert.IsEqual(Value.Check(R, [T], { x: 1, y: 2, z: 3 }), true)
    Assert.IsEqual(Value.Check(R, [T], { x: 1, y: 2, z: 3, r: { name: 'hello' } }), true)
    Assert.IsEqual(Value.Check(R, [T], { x: 1, y: 2, z: 3, r: { name: 1 } }), false)
    Assert.IsEqual(Value.Check(R, [T], { x: 1, y: 2, z: 3, r: {} }), false)
    // Ok(R, { x: 1, y: 2, z: 3 }, [T])
    // Ok(R, , [T])
    // Fail(R, , [T])
    // Fail(R, , [T])
  })

  it('Should reference recursive schema', () => {
    const T = Type.Recursive((Node) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(Node),
      }),
    )
    const R = Type.Ref(T.$id!)
    Assert.IsEqual(Value.Check(R, [T], { id: '', nodes: [{ id: '', nodes: [] }] }), true)
    Assert.IsEqual(Value.Check(R, [T], { id: '', nodes: [{ id: 1, nodes: [] }] }), false)
  })
})

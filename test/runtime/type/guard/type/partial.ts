import { TypeGuard, TypeRegistry, Type, Kind, TransformKind } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TPartial', () => {
  it('Should produce a valid TSchema', () => {
    const T = Type.Partial(Type.Object({ x: Type.Number() }))
    Assert.IsTrue(TypeGuard.IsSchema(T))
  })
  // -------------------------------------------------------------------------
  // case: https://github.com/sinclairzx81/typebox/issues/364
  // -------------------------------------------------------------------------
  it('Should support TUnsafe partial properties with no Kind', () => {
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ x: 1 }) }))
    Assert.IsEqual(T.required, undefined)
  })
  it('Should support TUnsafe partial properties with unknown Kind', () => {
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ [Kind]: 'UnknownPartialType', x: 1 }) }))
    Assert.IsEqual(T.required, undefined)
  })
  it('Should support TUnsafe partial properties with known Kind', () => {
    TypeRegistry.Set('KnownPartialType', () => true)
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ [Kind]: 'KnownPartialType', x: 1 }) }))
    Assert.IsEqual(T.required, undefined)
  })
  it('Should support applying partial to intersect', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const I = Type.Intersect([A, B])
    const T = Type.Partial(I)
    Assert.IsEqual(T.allOf.length, 2)
    Assert.IsEqual(T.allOf[0].required, undefined)
    Assert.IsEqual(T.allOf[1].required, undefined)
  })
  it('Should support applying partial to union', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const I = Type.Union([A, B])
    const T = Type.Partial(I)
    Assert.IsEqual(T.anyOf.length, 2)
    Assert.IsEqual(T.anyOf[0].required, undefined)
    Assert.IsEqual(T.anyOf[1].required, undefined)
  })
  // ----------------------------------------------------------------
  // Discard
  // ----------------------------------------------------------------
  it('Should override $id', () => {
    const A = Type.Object({ x: Type.Number() }, { $id: 'A' })
    const T = Type.Partial(A, { $id: 'T' })
    Assert.IsEqual(T.$id!, 'T')
  })
  it('Should discard $id', () => {
    const A = Type.Object({ x: Type.Number() }, { $id: 'A' })
    const T = Type.Partial(A)
    Assert.IsFalse('$id' in T)
  })
  it('Should discard transform', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const S = Type.Transform(T)
      .Decode((value) => value)
      .Encode((value) => value)
    const R = Type.Partial(S)
    Assert.IsFalse(TransformKind in R)
  })
})

import { KindGuard, TypeRegistry, Type, Kind, TransformKind } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TRequired', () => {
  it('Should produce a valid TSchema', () => {
    const T = Type.Required(Type.Object({ x: Type.Number() }))
    Assert.IsTrue(KindGuard.IsSchema(T))
  })
  it('Should support TUnsafe required properties with no Kind', () => {
    const T = Type.Required(Type.Object({ x: Type.Optional(Type.Unsafe({ x: 1 })) }))
    Assert.IsEqual(T.required, ['x'])
  })
  it('Should support TUnsafe required properties with unknown Kind', () => {
    const T = Type.Required(Type.Object({ x: Type.Optional(Type.Unsafe({ [Kind]: 'UnknownRequiredType', x: 1 })) }))
    Assert.IsEqual(T.required, ['x'])
  })
  it('Should support TUnsafe required properties with known Kind', () => {
    TypeRegistry.Set('KnownRequiredType', () => true)
    const T = Type.Required(Type.Object({ x: Type.Optional(Type.Unsafe({ [Kind]: 'KnownRequiredType', x: 1 })) }))
    Assert.IsEqual(T.required, ['x'])
  })
  it('Should support applying required to intersect', () => {
    const A = Type.Object({ x: Type.Optional(Type.Number()) })
    const B = Type.Object({ y: Type.Optional(Type.Number()) })
    const I = Type.Intersect([A, B])
    const T = Type.Required(I)
    Assert.IsEqual(T.allOf.length, 2)
    Assert.IsEqual(T.allOf[0].required, ['x'])
    Assert.IsEqual(T.allOf[1].required, ['y'])
  })
  it('Should support applying required to union', () => {
    const A = Type.Object({ x: Type.Optional(Type.Number()) })
    const B = Type.Object({ y: Type.Optional(Type.Number()) })
    const I = Type.Union([A, B])
    const T = Type.Required(I)
    Assert.IsEqual(T.anyOf.length, 2)
    Assert.IsEqual(T.anyOf[0].required, ['x'])
    Assert.IsEqual(T.anyOf[1].required, ['y'])
  })
  // ----------------------------------------------------------------
  // Discard
  // ----------------------------------------------------------------
  it('Should override $id', () => {
    const A = Type.Object({ x: Type.Number() }, { $id: 'A' })
    const T = Type.Required(A, { $id: 'T' })
    Assert.IsEqual(T.$id!, 'T')
  })
  it('Should discard $id', () => {
    const A = Type.Object({ x: Type.Number() }, { $id: 'A' })
    const T = Type.Required(A)
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
    const R = Type.Required(S)
    Assert.IsFalse(TransformKind in R)
  })
})

import { TypeGuard, TypeRegistry, Type, Kind } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TPartial', () => {
  it('Should produce a valid TSchema', () => {
    const T = Type.Partial(Type.Object({ x: Type.Number() }))
    Assert.isTrue(TypeGuard.TSchema(T))
  })
  // -------------------------------------------------------------------------
  // case: https://github.com/sinclairzx81/typebox/issues/364
  // -------------------------------------------------------------------------
  it('Should support TUnsafe partial properties with no Kind', () => {
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ x: 1 }) }))
    Assert.isEqual(T.required, undefined)
  })
  it('Should support TUnsafe partial properties with unknown Kind', () => {
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ [Kind]: 'UnknownPartialType', x: 1 }) }))
    Assert.isEqual(T.required, undefined)
  })
  it('Should support TUnsafe partial properties with known Kind', () => {
    TypeRegistry.Set('KnownPartialType', () => true)
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ [Kind]: 'KnownPartialType', x: 1 }) }))
    Assert.isEqual(T.required, undefined)
  })
  it('Should support applying partial to intersect', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const I = Type.Intersect([A, B])
    const T = Type.Partial(I)
    Assert.isEqual(T.allOf.length, 2)
    Assert.isEqual(T.allOf[0].required, undefined)
    Assert.isEqual(T.allOf[1].required, undefined)
  })
  it('Should support applying partial to union', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const I = Type.Union([A, B])
    const T = Type.Partial(I)
    Assert.isEqual(T.anyOf.length, 2)
    Assert.isEqual(T.anyOf[0].required, undefined)
    Assert.isEqual(T.anyOf[1].required, undefined)
  })
})

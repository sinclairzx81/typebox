import { TypeGuard } from '@sinclair/typebox'
import { Type, CloneType } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TRef', () => {
  // ----------------------------------------------------------------
  // Deprecated
  // ----------------------------------------------------------------
  it('Should guard for Ref(Schema) 1', () => {
    const T = Type.Number({ $id: 'T' })
    const R = Type.Ref(T)
    Assert.IsTrue(TypeGuard.IsRef(R))
    Assert.IsTrue(typeof R['$ref'] === 'string')
  })
  it('Should guard for Ref(Schema) 2', () => {
    const T = Type.Number()
    Assert.Throws(() => Type.Ref(T))
  })
  it('Should guard for Ref(Schema) 3', () => {
    // @ts-ignore
    const T = Type.Number({ $id: null })
    Assert.Throws(() => Type.Ref(T))
  })
  // ----------------------------------------------------------------
  // Standard
  // ----------------------------------------------------------------
  it('Should guard for TRef', () => {
    const T = Type.Number({ $id: 'T' })
    const R = TypeGuard.IsRef(Type.Ref('T'))
    Assert.IsTrue(R)
  })
  it('Should not guard for TRef', () => {
    const R = TypeGuard.IsRef(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TRef with invalid $ref', () => {
    const T = Type.Number({ $id: 'T' })
    const S = CloneType(Type.Ref('T'))
    // @ts-ignore
    S.$ref = 1
    const R = TypeGuard.IsRef(S)
    Assert.IsFalse(R)
  })
})

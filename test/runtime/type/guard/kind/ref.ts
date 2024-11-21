import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TRef', () => {
  // ----------------------------------------------------------------
  // Deprecated
  // ----------------------------------------------------------------
  it('Should guard for Ref(Schema) 1', () => {
    const T = Type.Number({ $id: 'T' })
    const R = Type.Ref(T)
    Assert.IsTrue(KindGuard.IsRef(R))
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
    const R = KindGuard.IsRef(Type.Ref(T))
    Assert.IsTrue(R)
  })
  it('Should not guard for TRef', () => {
    const R = KindGuard.IsRef(null)
    Assert.IsFalse(R)
  })
})

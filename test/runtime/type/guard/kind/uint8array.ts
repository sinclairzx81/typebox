import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TUint8Array', () => {
  it('Should guard for TUint8Array', () => {
    const R = KindGuard.IsUint8Array(Type.Uint8Array())
    Assert.IsTrue(R)
  })
  it('Should not guard for TUint8Array', () => {
    const R = KindGuard.IsUint8Array(null)
    Assert.IsFalse(R)
  })
})

import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TRegExp', () => {
  it('Should guard for TRegExp 1', () => {
    const T = Type.RegExp(/foo/, { $id: 'T' })
    Assert.IsTrue(KindGuard.IsSchema(T))
  })
  it('Should guard for TRegExp 1', () => {
    const T = Type.RegExp(/foo/, { $id: 'T' })
    Assert.IsTrue(KindGuard.IsRegExp(T))
  })
  it('Should guard for TRegExp 2', () => {
    const T = Type.RegExp('foo', { $id: 'T' })
    Assert.IsTrue(KindGuard.IsRegExp(T))
  })
})

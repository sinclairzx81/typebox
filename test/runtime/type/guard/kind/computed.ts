import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TComputed', () => {
  // ----------------------------------------------------------------
  // Schema
  // ----------------------------------------------------------------
  it('Should guard for Schema', () => {
    const T = Type.Partial(Type.Ref('A'))
    Assert.IsTrue(KindGuard.IsComputed(T))
    Assert.IsTrue(KindGuard.IsSchema(T))
  })
  // ----------------------------------------------------------------
  // Record
  // ----------------------------------------------------------------
  it('Should guard for Record 1', () => {
    const T = Type.Record(Type.String(), Type.String())
    Assert.IsTrue(KindGuard.IsRecord(T))
  })
  it('Should guard for Record 3', () => {
    const T = Type.Record(Type.String(), Type.Ref('A'))
    Assert.IsTrue(KindGuard.IsRecord(T))
  })
  it('Should guard for Record 3', () => {
    const T = Type.Record(Type.String(), Type.Partial(Type.Ref('A')))
    Assert.IsTrue(KindGuard.IsRecord(T))
  })
  it('Should guard for Record 4', () => {
    const T = Type.Record(Type.Ref('A'), Type.String())
    Assert.IsTrue(KindGuard.IsNever(T))
  })
})

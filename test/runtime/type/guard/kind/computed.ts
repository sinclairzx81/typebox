import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TComputed', () => {
  // ----------------------------------------------------------------
  // Record
  // ----------------------------------------------------------------
  it('Should guard for Record 1', () => {
    const T = Type.Record(Type.String(), Type.String())
    Assert.IsTrue(KindGuard.IsRecord(T))
  })
  // TRecord<TRecordKey, TRef<...>> is not computed.
  it('Should guard for Record 3', () => {
    const T = Type.Record(Type.String(), Type.Ref('A'))
    Assert.IsTrue(KindGuard.IsRecord(T))
  })
  // TRecord<TRecordKey, TComputed<..., [TRef<...>]> is computed due to interior computed.
  it('Should guard for Record 3', () => {
    const T = Type.Record(Type.String(), Type.Partial(Type.Ref('A')))
    Assert.IsTrue(KindGuard.IsComputed(T))
  })
  // TRecord<TRef<...>, TSchema> is computed as schematics may be transformed to TObject if finite
  it('Should guard for Record 4', () => {
    const T = Type.Record(Type.Ref('A'), Type.String())
    Assert.IsTrue(KindGuard.IsComputed(T))
  })
})

import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TComputed', () => {
  // ----------------------------------------------------------------
  // Schema
  // ----------------------------------------------------------------
  it('Should guard for Schema', () => {
    const T = Type.Partial(Type.Ref('A'))
    Assert.IsTrue(TypeGuard.IsComputed(T))
    Assert.IsTrue(TypeGuard.IsSchema(T))
  })
  // ----------------------------------------------------------------
  // Record
  // ----------------------------------------------------------------
  it('Should guard for Record 1', () => {
    const T = Type.Record(Type.String(), Type.String())
    Assert.IsTrue(TypeGuard.IsRecord(T))
  })
  it('Should guard for Record 3', () => {
    const T = Type.Record(Type.String(), Type.Ref('A'))
    Assert.IsTrue(TypeGuard.IsRecord(T))
  })
  it('Should guard for Record 3', () => {
    const T = Type.Record(Type.String(), Type.Partial(Type.Ref('A')))
    Assert.IsTrue(TypeGuard.IsRecord(T))
  })
  it('Should guard for Record 4', () => {
    const T = Type.Record(Type.Ref('A'), Type.String())
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
})

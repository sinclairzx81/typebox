import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TRecord', () => {
  it('should guard for TRecord', () => {
    const R = TypeGuard.TRecord(Type.Record(Type.String(), Type.Number()))
    Assert.equal(R, true)
  })

  it('should guard for TRecord with TObject value', () => {
    const R = TypeGuard.TRecord(
      Type.Record(
        Type.String(),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ),
    )
    Assert.equal(R, true)
  })

  it('should not guard for TRecord', () => {
    const R = TypeGuard.TRecord(null)
    Assert.equal(R, false)
  })

  it('should not guard for TRecord with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TRecord(Type.Record(Type.String(), Type.Number(), { $id: 1 }))
    Assert.equal(R, false)
  })

  it('should not guard for TRecord with TObject value with invalid Property', () => {
    const R = TypeGuard.TRecord(
      Type.Record(
        Type.String(),
        Type.Object({
          x: Type.Number(),
          y: {} as any,
        }),
      ),
    )
    Assert.equal(R, false)
  })

  it('should not guard for TRecord with invalid literal key', () => {
    const K = Type.Union([Type.Literal('hello\nworld')])
    const R = TypeGuard.TRecord(Type.Record(K, Type.Number()))
    Assert.equal(R, false)
  })
})

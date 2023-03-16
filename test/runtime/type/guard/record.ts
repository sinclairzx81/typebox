import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TRecord', () => {
  it('Should guard for TRecord', () => {
    const R = TypeGuard.TRecord(Type.Record(Type.String(), Type.Number()))
    Assert.equal(R, true)
  })

  it('Should guard for TRecord with TObject value', () => {
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

  it('Should not guard for TRecord', () => {
    const R = TypeGuard.TRecord(null)
    Assert.equal(R, false)
  })

  it('Should not guard for TRecord with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TRecord(Type.Record(Type.String(), Type.Number(), { $id: 1 }))
    Assert.equal(R, false)
  })

  it('Should not guard for TRecord with TObject value with invalid Property', () => {
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

  it('Transform: Should should transform to TObject for single literal union value', () => {
    const K = Type.Union([Type.Literal('ok')])
    const R = TypeGuard.TObject(Type.Record(K, Type.Number()))
    Assert.equal(R, true)
  })
  it('Transform: Should should transform to TObject for multi literal union value', () => {
    const K = Type.Union([Type.Literal('A'), Type.Literal('B')])
    const R = TypeGuard.TObject(Type.Record(K, Type.Number()))
    Assert.equal(R, true)
  })
})

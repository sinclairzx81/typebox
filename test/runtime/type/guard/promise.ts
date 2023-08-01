import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TPromise', () => {
  it('Should guard for TPromise', () => {
    const R = TypeGuard.TPromise(Type.Promise(Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TPromise', () => {
    const R = TypeGuard.TPromise(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TPromise with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TPromise(Type.Promise(Type.Number(), { $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should guard for TPromise with nested TObject', () => {
    const R = TypeGuard.TPromise(
      Type.Promise(
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ),
    )
    Assert.IsTrue(R)
  })
  it('Should not guard for TPromise with nested TObject', () => {
    const R = TypeGuard.TPromise(
      Type.Promise(
        Type.Object({
          x: Type.Number(),
          y: {} as any,
        }),
      ),
    )
    Assert.IsFalse(R)
  })
})

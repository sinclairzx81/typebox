import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TPromise', () => {
  it('Should guard for TPromise', () => {
    const R = TypeGuard.IsPromise(Type.Promise(Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TPromise', () => {
    const R = TypeGuard.IsPromise(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TPromise with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsPromise(Type.Promise(Type.Number(), { $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should guard for TPromise with nested TObject', () => {
    const R = TypeGuard.IsPromise(
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
    const R = TypeGuard.IsPromise(
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

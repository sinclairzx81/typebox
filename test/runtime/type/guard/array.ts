import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TArray', () => {
  it('Should guard for TArray', () => {
    const R = TypeGuard.TArray(Type.Array(Type.Number()))
    Assert.equal(R, true)
  })

  it('Should not guard for TArray', () => {
    const R = TypeGuard.TArray(null)
    Assert.equal(R, false)
  })

  it('Should guard for nested object TArray', () => {
    const R = TypeGuard.TArray(
      Type.Array(
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ),
    )
    Assert.equal(R, true)
  })

  it('Should not guard for nested object TArray', () => {
    const R = TypeGuard.TArray(
      Type.Array(
        Type.Object({
          x: Type.Number(),
          y: {} as any,
        }),
      ),
    )
    Assert.equal(R, false)
  })

  it('Should not guard for TArray with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.Number(), { $id: 1 }))
    Assert.equal(R, false)
  })

  it('Should not guard for TArray with invalid minItems', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.String(), { minItems: '1' }))
    Assert.equal(R, false)
  })

  it('Should not guard for TArray with invalid maxItems', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.String(), { maxItems: '1' }))
    Assert.equal(R, false)
  })

  it('Should not guard for TArray with invalid uniqueItems', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.String(), { uniqueItems: '1' }))
    Assert.equal(R, false)
  })
})

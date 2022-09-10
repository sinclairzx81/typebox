import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TArray', () => {
  it('should guard for TArray', () => {
    const R = TypeGuard.TArray(Type.Array(Type.Number()))
    Assert.equal(R, true)
  })

  it('should not guard for TArray', () => {
    const R = TypeGuard.TArray(null)
    Assert.equal(R, false)
  })

  it('should guard for nested object TArray', () => {
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

  it('should not guard for nested object TArray', () => {
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

  it('should not guard for TArray with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.Number(), { $id: 1 }))
    Assert.equal(R, false)
  })

  it('should not guard for TArray with invalid minItems #1', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.String(), { minItems: '1' }))
    Assert.equal(R, false)
  })

  it('should not guard for TArray with invalid minItems #2', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.String(), { minItems: -1 }))
    Assert.equal(R, false)
  })

  it('should not guard for TArray with invalid maxItems #1', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.String(), { maxItems: '1' }))
    Assert.equal(R, false)
  })

  it('should not guard for TArray when minItems is greater than maxItems', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.String(), { maxItems: 2, minItems: 4 }))
    Assert.equal(R, false)
  })

  it('should not guard for TArray with invalid maxItems #2', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.String(), { maxItems: -1 }))
    Assert.equal(R, false)
  })

  it('should not guard for TArray with invalid uniqueItems', () => {
    // @ts-ignore
    const R = TypeGuard.TArray(Type.Array(Type.String(), { uniqueItems: '1' }))
    Assert.equal(R, false)
  })
})

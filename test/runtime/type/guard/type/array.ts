import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TArray', () => {
  it('Should guard for TArray', () => {
    const R = TypeGuard.IsArray(Type.Array(Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TArray', () => {
    const R = TypeGuard.IsArray(null)
    Assert.IsFalse(R)
  })
  it('Should guard for nested object TArray', () => {
    const R = TypeGuard.IsArray(
      Type.Array(
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ),
    )
    Assert.IsTrue(R)
  })
  it('Should not guard for nested object TArray', () => {
    const R = TypeGuard.IsArray(
      Type.Array(
        Type.Object({
          x: Type.Number(),
          y: {} as any,
        }),
      ),
    )
    Assert.IsFalse(R)
  })
  it('Should not guard for TArray with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsArray(Type.Array(Type.Number(), { $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TArray with invalid minItems', () => {
    // @ts-ignore
    const R = TypeGuard.IsArray(Type.Array(Type.String(), { minItems: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TArray with invalid maxItems', () => {
    // @ts-ignore
    const R = TypeGuard.IsArray(Type.Array(Type.String(), { maxItems: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TArray with invalid uniqueItems', () => {
    // @ts-ignore
    const R = TypeGuard.IsArray(Type.Array(Type.String(), { uniqueItems: '1' }))
    Assert.IsFalse(R)
  })
})

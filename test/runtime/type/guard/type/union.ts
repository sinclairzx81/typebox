import { TSchema, TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TUnion', () => {
  it('Should guard for TUnion', () => {
    const R = TypeGuard.IsUnion(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: Type.Number(),
        }),
      ]),
    )
    Assert.IsTrue(R)
  })
  it('Should not guard for TUnion', () => {
    const R = TypeGuard.IsUnion(null)
    Assert.IsFalse(R)
  })
  it('Should guard for TUnion with invalid $id', () => {
    const R = TypeGuard.IsUnion(
      // @ts-ignore
      Type.Union(
        [
          Type.Object({
            x: Type.Number(),
          }),
          Type.Object({
            y: Type.Number(),
          }),
        ],
        {
          // @ts-ignore
          $id: 1,
        },
      ),
    )
    Assert.IsFalse(R)
  })
  it('Should not guard for TUnion with invalid variant', () => {
    const R = TypeGuard.IsUnion(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        {} as TSchema,
      ]),
    )
    Assert.IsFalse(R)
  })
  it('Should not guard for TUnion with invalid object variant', () => {
    const R = TypeGuard.IsUnion(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: {} as any,
        }),
      ]),
    )
    Assert.IsFalse(R)
  })
  it('Transform: Should transform to never for zero length union', () => {
    const T = Type.Union([])
    const R = TypeGuard.IsNever(T)
    Assert.IsTrue(R)
  })
  it('Transform: Should unwrap union type for array of length === 1', () => {
    const T = Type.Union([Type.String()])
    const R = TypeGuard.IsString(T)
    Assert.IsTrue(R)
  })
  it('Transform: Should retain union if array length > 1', () => {
    const T = Type.Union([Type.String(), Type.Number()])
    const R1 = TypeGuard.IsUnion(T)
    const R2 = TypeGuard.IsString(T.anyOf[0])
    const R3 = TypeGuard.IsNumber(T.anyOf[1])
    Assert.IsTrue(R1)
    Assert.IsTrue(R2)
    Assert.IsTrue(R3)
  })
})

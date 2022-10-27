import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TUnion', () => {
  it('Should guard for TUnion', () => {
    const R = TypeGuard.TUnion(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: Type.Number(),
        }),
      ]),
    )
    Assert.equal(R, true)
  })
  it('Should not guard for TUnion', () => {
    const R = TypeGuard.TUnion(null)
    Assert.equal(R, false)
  })
  it('Should guard for TUnion with invalid $id', () => {
    const R = TypeGuard.TUnion(
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
    Assert.equal(R, false)
  })
  it('Should not guard for TUnion with invalid variant', () => {
    const R = TypeGuard.TUnion(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        {} as any,
      ]),
    )
    Assert.equal(R, false)
  })
  it('Should not guard for TUnion with invalid object variant', () => {
    const R = TypeGuard.TUnion(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: {} as any,
        }),
      ]),
    )
    Assert.equal(R, false)
  })
})

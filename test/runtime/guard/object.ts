import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TObject', () => {
  it('should guard for TObject', () => {
    const R = TypeGuard.TObject(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    )
    Assert.equal(R, true)
  })

  it('should not guard for TObject', () => {
    const R = TypeGuard.TObject(null)
    Assert.equal(R, false)
  })

  it('should not guard for TObject (invalid properties)', () => {
    const R = TypeGuard.TObject(
      Type.Object({
        x: Type.Number(),
        y: {} as any,
      }),
    )
    Assert.equal(R, false)
  })
})

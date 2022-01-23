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

  it('should not guard for TObject with escape characters in property key', () => {
    const R = TypeGuard.TObject(
      Type.Object({
        'hello\nworld': Type.Number(),
      }),
    )
    Assert.equal(R, false)
  })

  it('should not guard for TObject with invalid property values', () => {
    const R = TypeGuard.TObject(
      Type.Object({
        x: Type.Number(),
        y: {} as any,
      }),
    )
    Assert.equal(R, false)
  })

  it('should not guard for TObject with invalid additionalProperties', () => {
    const R = TypeGuard.TObject(
      Type.Object(
        {
          x: Type.Number(),
        },
        {
          // @ts-ignore
          additionalProperties: 'true',
        },
      ),
    )
    Assert.equal(R, false)
  })

  it('should not guard for TObject with invalid $id', () => {
    const R = TypeGuard.TObject(
      Type.Object(
        {
          x: Type.Number(),
        },
        {
          // @ts-ignore
          $id: 1,
        },
      ),
    )
    Assert.equal(R, false)
  })

  it('should not guard for TObject with invalid minProperties', () => {
    const R = TypeGuard.TObject(
      Type.Object(
        {
          x: Type.Number(),
        },
        {
          // @ts-ignore
          minProperties: '1',
        },
      ),
    )
    Assert.equal(R, false)
  })

  it('should not guard for TObject with invalid maxProperties', () => {
    const R = TypeGuard.TObject(
      Type.Object(
        {
          x: Type.Number(),
        },
        {
          // @ts-ignore
          maxProperties: '1',
        },
      ),
    )
    Assert.equal(R, false)
  })
})

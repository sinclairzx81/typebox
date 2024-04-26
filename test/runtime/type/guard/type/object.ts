import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TObject', () => {
  it('Should guard for TObject', () => {
    const R = TypeGuard.IsObject(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    )
    Assert.IsTrue(R)
  })
  it('Should not guard for TObject', () => {
    const R = TypeGuard.IsObject(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TObject with escape characters in property key', () => {
    const R = TypeGuard.IsObject(
      Type.Object({
        'hello\nworld': Type.Number(),
      }),
    )
    Assert.IsFalse(R)
  })
  it('Should not guard for TObject with invalid property values', () => {
    const R = TypeGuard.IsObject(
      Type.Object({
        x: Type.Number(),
        y: {} as any,
      }),
    )
    Assert.IsFalse(R)
  })
  it('Should not guard for TObject with invalid additionalProperties', () => {
    const R = TypeGuard.IsObject(
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
    Assert.IsFalse(R)
  })
  it('Should not guard for TObject with invalid $id', () => {
    const R = TypeGuard.IsObject(
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
    Assert.IsFalse(R)
  })
  it('Should not guard for TObject with invalid minProperties', () => {
    const R = TypeGuard.IsObject(
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
    Assert.IsFalse(R)
  })
  it('Should not guard for TObject with invalid maxProperties', () => {
    const R = TypeGuard.IsObject(
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
    Assert.IsFalse(R)
  })
  it('Should guard for TObject with invalid additional properties', () => {
    const R = TypeGuard.IsObject(
      Type.Object(
        {
          x: Type.Number(),
          y: Type.Number(),
        },
        {
          // @ts-ignore
          additionalProperties: 1,
        },
      ),
    )
    Assert.IsFalse(R)
  })
  it('Should not guard for TObject with valid additional properties schema', () => {
    const R = TypeGuard.IsObject(
      Type.Object(
        {
          x: Type.Number(),
          y: Type.Number(),
        },
        {
          additionalProperties: Type.String(),
        },
      ),
    )
    Assert.IsTrue(R)
  })
})

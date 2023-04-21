import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/KeyOf', () => {
  it('Should create value', () => {
    const T = Type.KeyOf(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    )
    Assert.isEqual(Value.Create(T), 'x')
  })
  it('Should create default', () => {
    const T = Type.KeyOf(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      { default: 'y' },
    )
    Assert.isEqual(Value.Create(T), 'y')
  })
})

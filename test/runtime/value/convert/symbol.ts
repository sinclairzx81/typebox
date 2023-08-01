import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Symbol', () => {
  const T = Type.Symbol()
  it('Should convert from number 1', () => {
    const R = Value.Convert(T, 3.14)
    Assert.IsEqual(R, '3.14')
  })
  it('Should convert from number 2', () => {
    const R = Value.Convert(T, 3)
    Assert.IsEqual(R, '3')
  })
})

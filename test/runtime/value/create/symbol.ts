import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Symbol', () => {
  it('Should create value', () => {
    const T = Type.Symbol()
    const V = Value.Create(T)
    Assert.isEqual(typeof V, 'symbol')
  })
  it('Should create default', () => {
    const T = Type.Symbol({ default: true })
    Assert.isEqual(Value.Create(T), true)
  })
})

import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Date', () => {
  it('Should create value', () => {
    const T = Type.Date()
    Assert.IsInstanceOf(Value.Create(T), Date)
  })
  it('Should create default', () => {
    const T = Type.Date({ default: 1 })
    Assert.IsEqual(Value.Create(T), 1)
  })
})

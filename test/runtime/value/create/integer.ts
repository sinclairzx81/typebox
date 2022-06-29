import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Integer', () => {
  it('Should create value', () => {
    const T = Type.Integer()
    Assert.deepEqual(Value.Create(T), 0)
  })
  it('Should create default', () => {
    const T = Type.Integer({ default: 7 })
    Assert.deepEqual(Value.Create(T), 7)
  })
})

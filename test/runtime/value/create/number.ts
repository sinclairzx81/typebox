import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Number', () => {
  it('Should create value', () => {
    const T = Type.Number()
    Assert.deepEqual(Value.Create(T), 0)
  })
  it('Should create default', () => {
    const T = Type.Number({ default: 7 })
    Assert.deepEqual(Value.Create(T), 7)
  })
})

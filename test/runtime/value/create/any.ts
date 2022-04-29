import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Any', () => {
  it('Should create value', () => {
    const T = Type.Any()
    Assert.deepEqual(Value.Create(T), {})
  })
  it('Should create default', () => {
    const T = Type.Any({ default: 1 })
    Assert.deepEqual(Value.Create(T), 1)
  })
})

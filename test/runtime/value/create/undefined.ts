import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Undefined', () => {
  it('Should create value', () => {
    const T = Type.Undefined()
    Assert.deepEqual(Value.Create(T), undefined)
  })
  it('Should create value from default value', () => {
    const T = Type.Undefined({ default: 'hello' })
    Assert.deepEqual(Value.Create(T), 'hello')
  })
})

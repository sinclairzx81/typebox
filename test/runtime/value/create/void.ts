import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Void', () => {
  it('Should create value', () => {
    const T = Type.Void()
    Assert.deepEqual(Value.Create(T), null)
  })

  it('Should create value from default value', () => {
    const T = Type.Void({ default: 'hello' })
    Assert.deepEqual(Value.Create(T), 'hello')
  })
})

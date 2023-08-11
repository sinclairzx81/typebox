import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Void', () => {
  it('Should create value', () => {
    const T = Type.Void()
    Assert.IsEqual(Value.Create(T), undefined)
  })
  it('Should create value from default value', () => {
    const T = Type.Void({ default: 'hello' })
    Assert.IsEqual(Value.Create(T), 'hello')
  })
})

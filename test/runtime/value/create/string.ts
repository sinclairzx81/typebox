import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/String', () => {
  it('Should create value', () => {
    const T = Type.String()
    Assert.IsEqual(Value.Create(T), '')
  })
  it('Should create default', () => {
    const T = Type.String({ default: 'hello' })
    Assert.IsEqual(Value.Create(T), 'hello')
  })
})

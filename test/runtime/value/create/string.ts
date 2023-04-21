import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/String', () => {
  it('Should create value', () => {
    const T = Type.String()
    Assert.isEqual(Value.Create(T), 0)
  })
  it('Should create default', () => {
    const T = Type.String({ default: 'hello' })
    Assert.isEqual(Value.Create(T), 'hello')
  })
})

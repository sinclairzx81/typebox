import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Null', () => {
  it('Should create value', () => {
    const T = Type.Null()
    Assert.isEqual(Value.Create(T), null)
  })
  it('Should create null from default value', () => {
    const T = Type.Null({ default: 'hello' })
    Assert.isEqual(Value.Create(T), 'hello')
  })
})

import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/RegEx', () => {
  it('Should throw without a default value', () => {
    Assert.throws(() => {
      const T = Type.RegExp(/foo/)
      Value.Create(T)
    })
  })
  it('Should create default', () => {
    const T = Type.RegExp(/foo/, { default: 'foo' })
    Assert.isEqual(Value.Create(T), 'foo')
  })
})

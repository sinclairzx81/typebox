import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/RegEx', () => {
  it('Should throw without a default value', () => {
    Assert.throws(() => {
      const T = Type.RegEx(/foo/)
      Value.Create(T)
    })
  })
  it('Should create default', () => {
    const T = Type.RegEx(/foo/, { default: 'foo' })
    Assert.deepEqual(Value.Create(T), 'foo')
  })
})

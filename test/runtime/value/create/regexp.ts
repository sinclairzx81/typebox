import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/RegEx', () => {
  it('Should throw without a default value', () => {
    Assert.Throws(() => {
      const T = Type.RegExp(/foo/)
      Value.Create(T)
    })
  })
  it('Should create default', () => {
    const T = Type.RegExp(/foo/, { default: 'foo' })
    Assert.IsEqual(Value.Create(T), 'foo')
  })
  // ----------------------------------------------------------------
  // Throw
  // ----------------------------------------------------------------
  it('Should throw with no default', () => {
    const T = Type.RegExp(/foo/)
    Assert.Throws(() => Value.Create(T))
  })
})

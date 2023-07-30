import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/Lowercase', () => {
  it('Should guard for Lowercase', () => {
    const T = Type.Lowercase(Type.Literal('HELLO'))
    Assert.IsEqual(T.const, 'hello')
  })
})

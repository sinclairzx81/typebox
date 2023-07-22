import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/Uppercase', () => {
  it('Should guard for Uppercase', () => {
    const T = Type.Uppercase(Type.Literal('hello'))
    Assert.IsEqual(T.const, 'HELLO')
  })
})

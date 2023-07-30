import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/Uncapitalize', () => {
  it('Should guard for Uncapitalize', () => {
    const T = Type.Uncapitalize(Type.Literal('HELLO'))
    Assert.IsEqual(T.const, 'hELLO')
  })
})

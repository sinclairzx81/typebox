import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/Capitalize', () => {
  it('Should guard for TCapitalize', () => {
    const T = Type.Capitalize(Type.Literal('hello'))
    Assert.IsEqual(T.const, 'Hello')
  })
})

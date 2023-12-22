import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/clean/TemplateLiteral', () => {
  it('Should clean 1', () => {
    const T = Type.TemplateLiteral('')
    const R = Value.Clean(T, null)
    Assert.IsEqual(R, null)
  })
})

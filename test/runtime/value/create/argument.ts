import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Argument', () => {
  it('Should create value', () => {
    const T = Type.Argument(0)
    Assert.IsEqual(Value.Create(T), {})
  })
})

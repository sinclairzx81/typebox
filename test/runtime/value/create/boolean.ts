import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Boolean', () => {
  it('Should create value', () => {
    const T = Type.Boolean()
    Assert.isEqual(Value.Create(T), false)
  })
  it('Should create default', () => {
    const T = Type.Boolean({ default: true })
    Assert.isEqual(Value.Create(T), true)
  })
})

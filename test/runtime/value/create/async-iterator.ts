import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/AsyncIterator', () => {
  it('Should create value', () => {
    const T = Type.AsyncIterator(Type.Any())
    const R = Value.Create(T)
    Assert.IsTrue(Symbol.asyncIterator in R)
  })
  it('Should create default', () => {
    const T = Type.AsyncIterator(Type.Any(), { default: 1 })
    const R = Value.Create(T)
    Assert.IsEqual(R, 1)
  })
})

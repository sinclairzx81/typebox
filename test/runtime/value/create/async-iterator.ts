import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/AsyncIterator', () => {
  it('Should create value', () => {
    const T = Type.AsyncIterator(Type.Any())
    const R = Value.Create(T)
    Assert.isTrue(Symbol.asyncIterator in R)
  })
  it('Should create default', () => {
    const T = Type.AsyncIterator(Type.Any(), { default: 1 })
    const R = Value.Create(T)
    Assert.isEqual(R, 1)
  })
})

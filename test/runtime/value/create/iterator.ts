import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Iterator', () => {
  it('Should create value', () => {
    const T = Type.Iterator(Type.Any())
    const R = Value.Create(T)
    Assert.IsTrue(Symbol.iterator in R)
  })
  it('Should create default', () => {
    const T = Type.Iterator(Type.Any(), { default: 1 })
    const R = Value.Create(T)
    Assert.IsEqual(R, 1)
  })
})

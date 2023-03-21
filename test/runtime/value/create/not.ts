import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Not', () => {
  it('Should create value', () => {
    const T = Type.Not(Type.String(), Type.Number())
    const R = Value.Create(T)
    Assert.equal(R, 0)
  })
  it('Should create value with default inner', () => {
    const T = Type.Not(Type.String(), Type.Number({ default: 100 }))
    const R = Value.Create(T)
    Assert.equal(R, 100)
  })
  it('Should create value with default outer', () => {
    const T = Type.Not(Type.String(), Type.Number(), { default: 100 })
    const R = Value.Create(T)
    Assert.equal(R, 100)
  })
})

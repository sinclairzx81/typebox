import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Not', () => {
  it('Should throw without default value', () => {
    const T = Type.Not(Type.String())
    Assert.Throws(() => Value.Create(T))
  })
  it('Should create value with default inner', () => {
    const T = Type.Not(Type.String(), { default: 100 })
    const R = Value.Create(T)
    Assert.IsEqual(R, 100)
  })
  it('Should create value with default outer', () => {
    const T = Type.Not(Type.String(), { default: 100 })
    const R = Value.Create(T)
    Assert.IsEqual(R, 100)
  })
})

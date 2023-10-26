import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/KeyOf', () => {
  it('Should use default', () => {
    const T = Type.KeyOf(Type.Object({ x: Type.Number() }), { default: 1 })
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.KeyOf(Type.Object({ x: Type.Number() }), { default: 1 })
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
})

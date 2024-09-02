import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Function', () => {
  it('Should create value', () => {
    const T = Type.Function([], Type.Number({ default: 123 }))
    const F = Value.Create(T)
    const R = F()
    Assert.IsEqual(R, 123)
  })
  it('Should create default', () => {
    const T = Type.Function([], Type.Number({ default: 123 }), { default: () => () => 321 })
    const F = Value.Create(T)
    const R = F()
    Assert.IsEqual(R, 321)
  })
})

import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Union', () => {
  it('Should convert union variant', () => {
    const T = Type.Object({
      x: Type.Union([Type.Number(), Type.Null()]),
    })
    const V1 = Value.Convert(T, { x: '42' })
    const V2 = Value.Convert(T, { x: 'null' })
    const V3 = Value.Convert(T, { x: 'hello' })
    Assert.IsEqual(V1, { x: 42 })
    Assert.IsEqual(V2, { x: null })
    Assert.IsEqual(V3, { x: 'hello' })
  })
  it('Should convert last variant in ambiguous conversion', () => {
    const T = Type.Object({
      x: Type.Union([Type.Boolean(), Type.Number()]),
    })
    const V1 = Value.Convert(T, { x: '1' })
    Assert.IsEqual(V1, { x: 1 })
  })
})

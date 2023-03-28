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
    Assert.deepEqual(V1, { x: 42 })
    Assert.deepEqual(V2, { x: null })
    Assert.deepEqual(V3, { x: 'hello' })
  })
  it('Should convert first variant in ambiguous conversion', () => {
    const T = Type.Object({
      x: Type.Union([Type.Boolean(), Type.Number()]),
    })
    const V1 = Value.Convert(T, { x: '1' })
    Assert.deepEqual(V1, { x: true })
  })
})

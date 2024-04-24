import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// prettier-ignore
describe('value/convert/Object', () => {
  it('Should convert properties', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.Boolean(),
      z: Type.Boolean()
    })
    const R = Value.Convert(T, { x: '42', y: 'true', z: 'hello' })
    Assert.IsEqual(R, { x: 42, y: true, z: 'hello' })
  })
  it('Should convert known properties', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.Boolean()
    })
    const R = Value.Convert(T, { x: '42', y: 'true', z: 'hello' })
    Assert.IsEqual(R, { x: 42, y: true, z: 'hello' })
  })
})

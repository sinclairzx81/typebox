import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Object', () => {
  it('Should convert properties', () => {
    // prettier-ignore
    const T = Type.Object({
      x: Type.Number(),
      y: Type.Boolean(),
      z: Type.Boolean()
    })
    const R = Value.Convert(T, { x: '42', y: 'true', z: 'hello' })
    Assert.deepEqual(R, { x: 42, y: true, z: 'hello' })
  })
})

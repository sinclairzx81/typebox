import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Composite', () => {
  it('Should convert properties', () => {
    // prettier-ignore
    const T = Type.Composite([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Boolean() }),
      Type.Object({ z: Type.Boolean() })
    ])
    const R = Value.Convert(T, { x: '42', y: 'true', z: 'hello' })
    Assert.IsEqual(R, { x: 42, y: true, z: 'hello' })
  })
})

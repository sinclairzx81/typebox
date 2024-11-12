import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Ref', () => {
  it('Should throw if target is undefined', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: 'T', default: 'target' },
    )
    const R = Type.Ref('T')
    Assert.Throws(() => Value.Create(R))
  })
  it('Should create ref default if ref default is defined', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: 'T', default: 'target' },
    )
    const R = Type.Ref('T', { default: 'override' })
    Assert.IsEqual(Value.Create(R), 'override') // terminated at R default value
  })
  it('Should dereference remote schema via $ref', () => {
    const R = Type.Number({ $id: 'R' })
    const T = Type.Object({ x: Type.Ref('R') })
    Assert.IsEqual(Value.Create(T, [R]), { x: 0 })
  })
})

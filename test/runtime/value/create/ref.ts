import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Ref', () => {
  it('Should create target default if ref default is undefined', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: 'T', default: 'target' },
    )
    const R = Type.Ref(T)
    Assert.deepEqual(Value.Create(R), 'target')
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
    const R = Type.Ref(T, { default: 'override' })
    Assert.deepEqual(Value.Create(R), 'override')
  })
})

import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/clean/Array', () => {
  it('Should clean 1', () => {
    const T = Type.Any()
    const R = Value.Clean(T, null)
    Assert.IsEqual(R, null)
  })
  it('Should clean 2', () => {
    const T = Type.Array(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    )
    const R = Value.Clean(T, [undefined, null, { x: 1 }, { x: 1, y: 2 }, { x: 1, y: 2, z: 3 }])
    Assert.IsEqual(R, [undefined, null, { x: 1 }, { x: 1, y: 2 }, { x: 1, y: 2 }])
  })
})

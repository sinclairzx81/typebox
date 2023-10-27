import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/clean/Function', () => {
  it('Should clean 1', () => {
    const T = Type.Function([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })], Type.Object({ z: Type.Number() }))
    const R = Value.Clean(T, null)
    Assert.IsEqual(R, null)
  })
})

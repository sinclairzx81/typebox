import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/strict/Intersect', () => {
  it('Should clean 1', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    const R = Value.Strict(T, null)
    Assert.IsEqual(R, null)
  })
  it('Should clean 2', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    const R = Value.Strict(T, {})
    Assert.IsEqual(R, {})
  })
  it('Should clean 3', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    const R = Value.Strict(T, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should clean 4', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    const R = Value.Strict(T, { x: 1, y: 2, z: 3 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
})

import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Intersect')

Test('Should Convert intersected objects', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Convert(T, { x: '1', y: '2' })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
// ----------------------------------------------------------------
// Intersection Complex
// ----------------------------------------------------------------
Test('Should complex intersect 1', () => {
  const T = Type.Intersect([
    Type.Number(),
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Convert(T, { x: '1', y: '2' })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
Test('Should complex intersect 2', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Number()
  ])
  const R = Value.Convert(T, { x: '3', y: '4' })
  Assert.IsEqual(R, { x: 3, y: 4 })
})
Test('Should complex intersect 3', () => {
  const T = Type.Intersect([
    Type.Number(), // lost in Evaluate
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Convert(T, '123')
  Assert.IsEqual(R, '123')
})

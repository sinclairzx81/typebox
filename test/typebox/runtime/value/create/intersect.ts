import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Intersect')

Test('Should Create 1', () => {
  const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
  const R = Value.Create(T)
  Assert.IsEqual(R, { x: 0, y: 0 })
})
Test('Should Create 2', () => {
  const T = Type.Intersect([Type.Object({ x: Type.Number({ default: 100 }) }), Type.Object({ y: Type.Number({ default: 200 }) })])
  const R = Value.Create(T)
  Assert.IsEqual(R, { x: 100, y: 200 })
})
Test('Should Create 3', () => {
  const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.Number(), y: Type.Number() })])
  const R = Value.Create(T)
  Assert.IsEqual(R, { x: 0, y: 0 })
})
Test('Should Create 4', () => {
  const T = Type.Intersect([Type.Object({ x: Type.Number({ default: 1 }) }), Type.Object({ x: Type.Number({ default: 2 }), y: Type.Number() })])
  const R = Value.Create(T)
  Assert.IsEqual(R, { x: 2, y: 0 })
})
Test('Should Create 5', () => {
  const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.String() })])
  Assert.Throws(() => Value.Create(T))
})
Test('Should Create 6', () => {
  const T = Type.Intersect([Type.String(), Type.Number()])
  Assert.Throws(() => Value.Create(T))
})
Test('Should Create 7', () => {
  const T = Type.Intersect([Type.String(), Type.Number()], { default: 'hello' })
  const R = Value.Create(T)
  Assert.IsEqual(R, 'hello')
})
Test('Should Create 8', () => {
  const T = Type.Intersect([
    Type.Object({
      x: Type.Number({ default: 1 })
    }),
    Type.Intersect([
      Type.Object({
        y: Type.Number({ default: 2 })
      }),
      Type.Object({
        z: Type.Number({ default: 3 })
      })
    ])
  ])
  const R = Value.Create(T)
  Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
})
Test('Should Create 9', () => {
  const T = Type.Intersect([Type.Number(), Type.Number(), Type.Number()])
  const R = Value.Create(T)
  Assert.IsEqual(R, 0)
})

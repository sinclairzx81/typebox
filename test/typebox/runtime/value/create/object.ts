import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Object')

Test('Should Create 1', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  Assert.IsEqual(Value.Create(T), {
    x: 0,
    y: 0,
    z: 0
  })
})
Test('Should Create 2', () => {
  const T = Type.Object({
    x: Type.Optional(Type.Number()),
    y: Type.Optional(Type.Number()),
    z: Type.Optional(Type.Number())
  })
  Assert.IsEqual(Value.Create(T), {})
})
Test('Should Create 3', () => {
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 }),
    z: Type.Number({ default: 3 })
  })
  Assert.IsEqual(Value.Create(T), {
    x: 1,
    y: 2,
    z: 3
  })
})
Test('Should Create 4', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number(),
    w: Type.Object({
      x: Type.Number({ default: 7 }),
      y: Type.Number(),
      z: Type.Number()
    })
  })
  Assert.IsEqual(Value.Create(T), {
    x: 0,
    y: 0,
    z: 0,
    w: { x: 7, y: 0, z: 0 }
  })
})
Test('Should Create 5', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { default: { x: 1, y: 2, z: 3 } }
  )
  Assert.IsEqual(Value.Create(T), {
    x: 1,
    y: 2,
    z: 3
  })
})
// ----------------------------------------------------------------
// Mutation
// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/726
Test('Should Create 6', () => {
  const T = Type.Object(
    {
      x: Type.Number()
    },
    { default: { x: 1 } }
  )
  const V = Value.Create(T)
  V.x = 123
  // @ts-ignore
  Assert.IsEqual(T.default, { x: 1 })
})

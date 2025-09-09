import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Union')

Test('Should Create 1', () => {
  const A = Type.Object({
    type: Type.Literal('A'),
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const B = Type.Object({
    type: Type.Literal('B'),
    x: Type.String(),
    y: Type.String(),
    z: Type.String()
  })
  const T = Type.Union([A, B])
  Assert.IsEqual(Value.Create(T), {
    type: 'A',
    x: 0,
    y: 0,
    z: 0
  })
})
Test('Should Create 2', () => {
  const A = Type.Null()
  const B = Type.Object({
    type: Type.Literal('B'),
    x: Type.String(),
    y: Type.String(),
    z: Type.String()
  })
  const T = Type.Union([A, B])
  Assert.IsEqual(Value.Create(T), null)
})
Test('Should Create 3', () => {
  const A = Type.Array(Type.String())
  const B = Type.Object({
    type: Type.Literal('B'),
    x: Type.String(),
    y: Type.String(),
    z: Type.String()
  })
  const T = Type.Union([A, B])
  Assert.IsEqual(Value.Create(T), [])
})
Test('Should Create 4', () => {
  const T = Type.Union([])
  Assert.Throws(() => Value.Create(T))
})
Test('Should Create 5', () => {
  const T = Type.Union([Type.Literal(1)])
  const R = Value.Create(T)
  Assert.IsEqual(R, 1)
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Create 6', () => {
  const T = Type.Union([Type.Never()])
  Assert.Throws(() => Value.Create(T))
})

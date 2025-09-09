import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.TemplateLiteral')

Test('Should Create 1', () => {
  const T = Type.TemplateLiteral([Type.Literal('A')])
  const V = Value.Create(T)
  Assert.IsEqual(V, 'A')
})

Test('Should Create 2', () => {
  const T = Type.TemplateLiteral([Type.Literal('A'), Type.Literal('B')])
  const V = Value.Create(T)
  Assert.IsEqual(V, 'AB')
})

Test('Should Create 3', () => {
  const T = Type.TemplateLiteral([Type.Literal('A'), Type.Union([Type.Literal('B'), Type.Literal('C')])])
  const V = Value.Create(T)
  Assert.IsEqual(V, 'AB')
})

Test('Should Create 4', () => {
  const T = Type.TemplateLiteral([Type.Boolean()])
  const V = Value.Create(T)
  Assert.IsEqual(V, 'false')
})

Test('Should Create 5', () => {
  const T = Type.TemplateLiteral([Type.Number()])
  Assert.Throws(() => Value.Create(T))
})

Test('Should Create 6', () => {
  const T = Type.TemplateLiteral([Type.Number()], { default: 42 })
  const V = Value.Create(T)
  Assert.IsEqual(V, 42)
})

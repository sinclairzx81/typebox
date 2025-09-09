import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Required')

Test('Should convert a partial object into a required object', () => {
  const A = Type.Object(
    {
      x: Type.Optional(Type.Number()),
      y: Type.Optional(Type.Number()),
      z: Type.Optional(Type.Number())
    },
    { additionalProperties: false }
  )
  const T = Type.Required(A)
  Ok(T, { x: 1, y: 1, z: 1 })
  Fail(T, { x: 1, y: 1 })
  Fail(T, { x: 1 })
  Fail(T, {})
})
Test('Should update modifier types correctly when converting to required', () => {
  const A = Type.Object({
    x: Type.Readonly(Type.Optional(Type.Number())),
    y: Type.Readonly(Type.Number()),
    z: Type.Optional(Type.Number()),
    w: Type.Number()
  })
  const T = Type.Required(A)
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.y))
  Assert.IsFalse(Type.IsReadonly(T.properties.z))
  Assert.IsFalse(Type.IsReadonly(T.properties.w))
})
Test('Should not inherit options from the source object', () => {
  const A = Type.Object(
    {
      x: Type.Optional(Type.Number()),
      y: Type.Optional(Type.Number()),
      z: Type.Optional(Type.Number())
    },
    { additionalPropeties: false }
  )
  const T = Type.Required(A)
  Assert.HasPropertyKey(A, 'additionalPropeties')
  Assert.IsEqual(A.additionalPropeties, false)
  Assert.NotHasPropertyKey(T, 'additionalPropeties')
})

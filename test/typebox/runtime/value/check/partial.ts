import { Assert } from 'test'
import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'

const Test = Assert.Context('Value.Check.Partial')

Test('Should convert a required object into a partial', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Partial(A)
  Ok(T, { x: 1, y: 1, z: 1 })
  Ok(T, { x: 1, y: 1 })
  Ok(T, { x: 1 })
  Ok(T, {})
})
Test('Should update modifier types correctly when converting to partial', () => {
  const A = Type.Object(
    {
      x: Type.Readonly(Type.Optional(Type.Number())),
      y: Type.Readonly(Type.Number()),
      z: Type.Optional(Type.Number()),
      w: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Partial(A)
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.y))
  Assert.IsTrue(Type.IsOptional(T.properties.y))
  Assert.IsTrue(Type.IsOptional(T.properties.z))
  Assert.IsTrue(Type.IsOptional(T.properties.w))
})
Test('Should not inherit options from the source object', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Partial(A)
  Assert.HasPropertyKey(A, 'additionalProperties')
  Assert.IsEqual(A.additionalProperties, false)
  Assert.NotHasPropertyKey(T, 'additionalProperties')
})

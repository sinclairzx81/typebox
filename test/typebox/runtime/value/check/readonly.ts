import { Assert } from 'test'
import { Type } from 'typebox'
import { Ok } from './_validate.ts'

const Test = Assert.Context('Value.Check.Readonly')

Test('Should validate object with readonly', () => {
  const T = Type.Object(
    {
      a: Type.Readonly(Type.String()),
      b: Type.Readonly(Type.String())
    },
    { additionalProperties: false }
  )
  Ok(T, { a: 'hello', b: 'world' })
})
Test('Should retain required array on object', () => {
  const T = Type.Object(
    {
      a: Type.Readonly(Type.String()),
      b: Type.Readonly(Type.String())
    },
    { additionalProperties: false }
  )
  Assert.IsEqual(T.required!.includes('a'), true)
  Assert.IsEqual(T.required!.includes('b'), true)
})

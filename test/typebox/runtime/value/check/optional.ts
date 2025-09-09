import { Assert } from 'test'
import { Type } from 'typebox'
import { Ok } from './_validate.ts'

const Test = Assert.Context('Value.Check.Optional')

Test('Should validate object with optional', () => {
  const T = Type.Object(
    {
      a: Type.Optional(Type.String()),
      b: Type.String()
    },
    { additionalProperties: false }
  )
  Ok(T, { a: 'hello', b: 'world' })
  Ok(T, { b: 'world' })
})
Test('Should remove required value from schema', () => {
  const T = Type.Object(
    {
      a: Type.Optional(Type.String()),
      b: Type.String()
    },
    { additionalProperties: false }
  )
  Assert.IsEqual(T.required.includes('a' as never), false)
})

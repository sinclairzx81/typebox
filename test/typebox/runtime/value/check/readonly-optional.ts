import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.ReadonlyOptional')

Test('Should validate object with optional', () => {
  const T = Type.Object(
    {
      a: Type.Readonly(Type.Optional(Type.String())),
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
      a: Type.Readonly(Type.Optional(Type.String())),
      b: Type.String()
    },
    { additionalProperties: false }
  )
  Assert.IsEqual(T.required.includes('a' as never), false)
})

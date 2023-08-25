import { Type } from '@sinclair/typebox'
import { Ok } from './validate'
import { Assert } from '../assert'

describe('compiler-ajv/ReadonlyOptional', () => {
  it('Should validate object with optional', () => {
    const T = Type.Object(
      {
        a: Type.Readonly(Type.Optional(Type.String())),
        b: Type.String(),
      },
      { additionalProperties: false },
    )
    Ok(T, { a: 'hello', b: 'world' })
    Ok(T, { b: 'world' })
  })
  it('Should remove required value from schema', () => {
    const T = Type.Object(
      {
        a: Type.Readonly(Type.Optional(Type.String())),
        b: Type.String(),
      },
      { additionalProperties: false },
    )
    Assert.IsEqual(T.required!.includes('a'), false)
  })
})

import { Type } from '@sinclair/typebox'
import { Ok } from './validate'
import { Assert } from '../assert'

describe('compiler-ajv/Readonly', () => {
  it('Should validate object with readonly', () => {
    const T = Type.Object(
      {
        a: Type.Readonly(Type.String()),
        b: Type.Readonly(Type.String()),
      },
      { additionalProperties: false },
    )
    Ok(T, { a: 'hello', b: 'world' })
  })
  it('Should retain required array on object', () => {
    const T = Type.Object(
      {
        a: Type.Readonly(Type.String()),
        b: Type.Readonly(Type.String()),
      },
      { additionalProperties: false },
    )
    Assert.IsEqual(T.required!.includes('a'), true)
    Assert.IsEqual(T.required!.includes('b'), true)
  })
})

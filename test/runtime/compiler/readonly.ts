import { deepStrictEqual, strictEqual } from 'assert'
import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler/Readonly', () => {
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
    strictEqual(T.required!.includes('a'), true)
    strictEqual(T.required!.includes('b'), true)
  })
})

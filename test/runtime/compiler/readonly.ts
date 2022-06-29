import { deepStrictEqual, strictEqual } from 'assert'
import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/Readonly', () => {
  it('Should validate object with readonly', () => {
    const T = Type.Object(
      {
        a: Type.Readonly(Type.String()),
        b: Type.Readonly(Type.String()),
      },
      { additionalProperties: false },
    )
    ok(T, { a: 'hello', b: 'world' })
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

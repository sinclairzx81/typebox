import { strictEqual } from 'assert'
import { Type } from '@sinclair/typebox'
import { ok } from './validate'

describe('type/schema/Optional', () => {
  it('Should validate object with optional', () => {
    const T = Type.Object(
      {
        a: Type.Optional(Type.String()),
        b: Type.String(),
      },
      { additionalProperties: false },
    )
    ok(T, { a: 'hello', b: 'world' })
    ok(T, { b: 'world' })
  })
  it('Should remove required value from schema', () => {
    const T = Type.Object(
      {
        a: Type.Optional(Type.String()),
        b: Type.String(),
      },
      { additionalProperties: false },
    )
    strictEqual(T.required!.includes('a'), false)
  })
})

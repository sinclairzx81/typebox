import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { strictEqual } from 'assert'

describe('type/schema/ReadonlyOptional', () => {
  it('Should validate object with optional', () => {
    const T = Type.Object(
      {
        a: Type.ReadonlyOptional(Type.String()),
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
        a: Type.ReadonlyOptional(Type.String()),
        b: Type.String(),
      },
      { additionalProperties: false },
    )
    strictEqual(T.required!.includes('a'), false)
  })
})

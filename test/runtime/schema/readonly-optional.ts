import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'
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
    Ok(T, { a: 'hello', b: 'world' })
    Ok(T, { b: 'world' })
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

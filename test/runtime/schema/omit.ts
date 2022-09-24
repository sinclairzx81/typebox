import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { strictEqual } from 'assert'

describe('type/schema/Omit', () => {
  it('Should omit properties on the source schema', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Omit(A, ['z'])
    ok(T, { x: 1, y: 1 })
  })

  it('Should remove required properties on the target schema', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Omit(A, ['z'])
    strictEqual(T.required!.includes('z'), false)
  })

  it('Should delete the required property if no required properties remain', () => {
    const A = Type.Object(
      {
        x: Type.Optional(Type.Number()),
        y: Type.ReadonlyOptional(Type.Number()),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Omit(A, ['z'])
    strictEqual(T.required, undefined)
  })

  it('Should inherit options from the source object', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Omit(A, ['z'])
    strictEqual(A.additionalProperties, false)
    strictEqual(T.additionalProperties, false)
  })

  it('Should omit with keyof object', () => {
    const A = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    const B = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })
    const T = Type.Omit(A, Type.KeyOf(B), { additionalProperties: false })
    ok(T, { z: 0 })
    fail(T, { x: 0, y: 0, z: 0 })
  })
})

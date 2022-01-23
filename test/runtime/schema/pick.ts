import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { strictEqual } from 'assert'

describe('type/schema/Pick', () => {
  it('Should pick properties from the source schema', () => {
    const Vector3 = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Pick(Vector3, ['x', 'y'])
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
    const T = Type.Pick(A, ['x', 'y'])
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
    const T = Type.Pick(A, ['x', 'y'])
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
    const T = Type.Pick(A, ['x', 'y'])
    strictEqual(A.additionalProperties, false)
    strictEqual(T.additionalProperties, false)
  })

  it('Should pick with keyof object', () => {
    const A = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    const B = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })
    const T = Type.Pick(A, Type.KeyOf(B), { additionalProperties: false })
    ok(T, { x: 0, y: 0 })
    fail(T, { x: 0, y: 0, z: 0 })
  })
})

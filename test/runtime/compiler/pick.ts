import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'
import { strictEqual } from 'assert'

describe('compiler/Pick', () => {
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
    Ok(T, { x: 1, y: 1 })
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
    Ok(T, { x: 0, y: 0 })
    Fail(T, { x: 0, y: 0, z: 0 })
  })
  it('Should support Pick of Literal', () => {
    const A = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    const T = Type.Pick(A, Type.Literal('x'), {
      additionalProperties: false,
    })
    Ok(T, { x: 1 })
    Fail(T, { x: 1, y: 1, z: 1 })
  })
  it('Should support Pick of Never', () => {
    const A = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    const T = Type.Pick(A, Type.Never(), {
      additionalProperties: false,
    })
    Fail(T, { x: 1, y: 1, z: 1 })
    Ok(T, {})
  })
})

import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'
import { Assert } from '../assert'

describe('compiler-ajv/Pick', () => {
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
    Assert.IsEqual(T.required!.includes('z'), false)
  })
  it('Should delete the required property if no required properties remain', () => {
    const A = Type.Object(
      {
        x: Type.Optional(Type.Number()),
        y: Type.Readonly(Type.Optional(Type.Number())),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Pick(A, ['x', 'y'])
    Assert.IsEqual(T.required, undefined)
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
    Assert.IsEqual(A.additionalProperties, false)
    Assert.IsEqual(T.additionalProperties, false)
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
})

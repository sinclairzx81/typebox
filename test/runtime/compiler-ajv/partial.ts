import { Type, Readonly, Optional } from '@sinclair/typebox'
import { Ok } from './validate'
import { Assert } from '../assert'

describe('compiler-ajv/Partial', () => {
  it('Should convert a required object into a partial.', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Partial(A)
    Ok(T, { x: 1, y: 1, z: 1 })
    Ok(T, { x: 1, y: 1 })
    Ok(T, { x: 1 })
    Ok(T, {})
  })
  it('Should update modifier types correctly when converting to partial', () => {
    const A = Type.Object(
      {
        x: Type.Readonly(Type.Optional(Type.Number())),
        y: Type.Readonly(Type.Number()),
        z: Type.Optional(Type.Number()),
        w: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Partial(A)
    Assert.IsEqual(T.properties.x[Readonly], 'Readonly')
    Assert.IsEqual(T.properties.x[Optional], 'Optional')
    Assert.IsEqual(T.properties.y[Readonly], 'Readonly')
    Assert.IsEqual(T.properties.y[Optional], 'Optional')
    Assert.IsEqual(T.properties.z[Optional], 'Optional')
    Assert.IsEqual(T.properties.w[Optional], 'Optional')
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
    const T = Type.Partial(A)
    Assert.IsEqual(A.additionalProperties, false)
    Assert.IsEqual(T.additionalProperties, false)
  })
})

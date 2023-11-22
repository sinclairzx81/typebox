import { TypeSystem } from '@sinclair/typebox/system'
import { Type, OptionalKind, ReadonlyKind } from '@sinclair/typebox'
import { Ok, Fail } from './validate'
import { strictEqual } from 'assert'

describe('compiler/Partial', () => {
  it('Should convert a required object into a partial', () => {
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
    strictEqual(T.properties.x[ReadonlyKind], 'Readonly')
    strictEqual(T.properties.x[OptionalKind], 'Optional')
    strictEqual(T.properties.y[ReadonlyKind], 'Readonly')
    strictEqual(T.properties.y[OptionalKind], 'Optional')
    strictEqual(T.properties.z[OptionalKind], 'Optional')
    strictEqual(T.properties.w[OptionalKind], 'Optional')
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
    strictEqual(A.additionalProperties, false)
    strictEqual(T.additionalProperties, false)
  })
})

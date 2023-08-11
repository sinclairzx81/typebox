import { TypeSystem } from '@sinclair/typebox/system'
import { Type, Kind, Optional, Readonly } from '@sinclair/typebox'
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
    strictEqual(T.properties.x[Readonly], 'Readonly')
    strictEqual(T.properties.x[Optional], 'Optional')
    strictEqual(T.properties.y[Readonly], 'Readonly')
    strictEqual(T.properties.y[Optional], 'Optional')
    strictEqual(T.properties.z[Optional], 'Optional')
    strictEqual(T.properties.w[Optional], 'Optional')
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

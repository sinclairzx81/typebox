import { Type, ReadonlyKind, OptionalKind } from '@sinclair/typebox'
import { Ok, Fail } from './validate'
import { strictEqual } from 'assert'

describe('compiler/Required', () => {
  it('Should convert a partial object into a required object', () => {
    const A = Type.Object(
      {
        x: Type.Optional(Type.Number()),
        y: Type.Optional(Type.Number()),
        z: Type.Optional(Type.Number()),
      },
      { additionalProperties: false },
    )
    const T = Type.Required(A)
    Ok(T, { x: 1, y: 1, z: 1 })
    Fail(T, { x: 1, y: 1 })
    Fail(T, { x: 1 })
    Fail(T, {})
  })
  it('Should update modifier types correctly when converting to required', () => {
    const A = Type.Object({
      x: Type.Readonly(Type.Optional(Type.Number())),
      y: Type.Readonly(Type.Number()),
      z: Type.Optional(Type.Number()),
      w: Type.Number(),
    })
    const T = Type.Required(A)
    strictEqual(T.properties.x[ReadonlyKind], 'Readonly')
    strictEqual(T.properties.y[ReadonlyKind], 'Readonly')
    strictEqual(T.properties.z[OptionalKind], undefined)
    strictEqual(T.properties.w[OptionalKind], undefined)
  })
  it('Should inherit options from the source object', () => {
    const A = Type.Object(
      {
        x: Type.Optional(Type.Number()),
        y: Type.Optional(Type.Number()),
        z: Type.Optional(Type.Number()),
      },
      { additionalPropeties: false },
    )
    const T = Type.Required(A)
    strictEqual(A.additionalPropeties, false)
    strictEqual(T.additionalPropeties, false)
  })

  // it('Should construct new object when targetting reference', () => {
  //   const T = Type.Object({ a: Type.String(), b: Type.String() }, { $id: 'T' })
  //   const R = Type.Ref(T)
  //   const P = Type.Required(R)
  //   strictEqual(P.properties.a.type, 'string')
  //   strictEqual(P.properties.b.type, 'string')
  // })
})

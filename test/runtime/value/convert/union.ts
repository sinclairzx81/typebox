import { Convert, Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Union', () => {
  it('Should convert union variant', () => {
    const T = Type.Object({
      x: Type.Union([Type.Number(), Type.Null()]),
    })
    const V1 = Value.Convert(T, { x: '42' })
    const V2 = Value.Convert(T, { x: 'null' })
    const V3 = Value.Convert(T, { x: 'hello' })
    Assert.IsEqual(V1, { x: 42 })
    Assert.IsEqual(V2, { x: null })
    Assert.IsEqual(V3, { x: 'hello' })
  })
  it('Should convert first variant in ambiguous conversion', () => {
    const T = Type.Object({
      x: Type.Union([Type.Boolean(), Type.Number()]),
    })
    const V1 = Value.Convert(T, { x: '1' })
    Assert.IsEqual(V1, { x: true })
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/787
  // ----------------------------------------------------------------
  // prettier-ignore
  it('Should convert Intersect Union', () => {
    const T = Type.Intersect([
      Type.Union([
        Type.Object({ a: Type.Number() }),
        Type.Object({ b: Type.Number() }),
      ]),
      Type.Object({ c: Type.Number() }),
    ])
    const A = Convert(T, { a: '1', c: '2' })
    const B = Convert(T, { b: '1', c: '2' })
    const C = Convert(T, { a: '1', b: '2', c: '3' })
    Assert.IsEqual(A, { a: 1, c: 2 })
    Assert.IsEqual(B, { b: 1, c: 2 })
    Assert.IsEqual(C, { a: 1, b: '2', c: 3 }) // note: matching on first
  })
})

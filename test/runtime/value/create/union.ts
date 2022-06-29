import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Union', () => {
  it('Should create union Object', () => {
    const A = Type.Object({
      type: Type.Literal('A'),
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    const B = Type.Object({
      type: Type.Literal('B'),
      x: Type.String(),
      y: Type.String(),
      z: Type.String(),
    })
    const T = Type.Union([A, B])
    Assert.deepEqual(Value.Create(T), {
      type: 'A',
      x: 0,
      y: 0,
      z: 0,
    })
  })

  it('Should create union Null', () => {
    const A = Type.Null()
    const B = Type.Object({
      type: Type.Literal('B'),
      x: Type.String(),
      y: Type.String(),
      z: Type.String(),
    })
    const T = Type.Union([A, B])
    Assert.deepEqual(Value.Create(T), null)
  })

  it('Should create union Array', () => {
    const A = Type.Array(Type.String())
    const B = Type.Object({
      type: Type.Literal('B'),
      x: Type.String(),
      y: Type.String(),
      z: Type.String(),
    })
    const T = Type.Union([A, B])
    Assert.deepEqual(Value.Create(T), [])
  })
})

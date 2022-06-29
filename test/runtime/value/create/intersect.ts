import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Intersect', () => {
  it('Should create value', () => {
    const A = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    const B = Type.Object({
      a: Type.Number(),
      b: Type.Number(),
      c: Type.Number(),
    })
    const T = Type.Intersect([A, B])
    Assert.deepEqual(Value.Create(T), {
      x: 0,
      y: 0,
      z: 0,
      a: 0,
      b: 0,
      c: 0,
    })
  })
  it('Should create default', () => {
    const A = Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 }),
      z: Type.Number({ default: 3 }),
    })
    const B = Type.Object({
      a: Type.Number({ default: 4 }),
      b: Type.Number({ default: 5 }),
      c: Type.Number({ default: 6 }),
    })
    const T = Type.Intersect([A, B])
    Assert.deepEqual(Value.Create(T), {
      x: 1,
      y: 2,
      z: 3,
      a: 4,
      b: 5,
      c: 6,
    })
  })
  it('Should create default and omit optionals', () => {
    const A = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    const B = Type.Object({
      a: Type.Optional(Type.Number()),
      b: Type.Optional(Type.Number()),
      c: Type.Optional(Type.Number()),
    })
    const T = Type.Intersect([A, B])
    Assert.deepEqual(Value.Create(T), {
      x: 0,
      y: 0,
      z: 0,
    })
  })
})

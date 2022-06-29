import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Object', () => {
  it('Should create value', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    Assert.deepEqual(Value.Create(T), {
      x: 0,
      y: 0,
      z: 0,
    })
  })

  it('Should create value with optional properties', () => {
    const T = Type.Object({
      x: Type.Optional(Type.Number()),
      y: Type.Optional(Type.Number()),
      z: Type.Optional(Type.Number()),
    })
    Assert.deepEqual(Value.Create(T), {})
  })

  it('Should create default with default properties', () => {
    const T = Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 }),
      z: Type.Number({ default: 3 }),
    })
    Assert.deepEqual(Value.Create(T), {
      x: 1,
      y: 2,
      z: 3,
    })
  })

  it('Should create nested object', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
      w: Type.Object({
        x: Type.Number({ default: 7 }),
        y: Type.Number(),
        z: Type.Number(),
      }),
    })
    Assert.deepEqual(Value.Create(T), {
      x: 0,
      y: 0,
      z: 0,
      w: { x: 7, y: 0, z: 0 },
    })
  })

  it('Should create with default', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { default: { x: 1, y: 2, z: 3 } },
    )
    Assert.deepEqual(Value.Create(T), {
      x: 1,
      y: 2,
      z: 3,
    })
  })
})

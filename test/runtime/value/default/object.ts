import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/Object', () => {
  it('Should use default', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
      },
      { default: 1 },
    )
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
      },
      { default: 1 },
    )
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // Construction
  // ----------------------------------------------------------------
  it('Should should fully construct object 1', () => {
    const T = Type.Object(
      {
        x: Type.Object(
          {
            x: Type.Number({ default: 1 }),
            y: Type.Number({ default: 2 }),
          },
          { default: {} },
        ),
        y: Type.Object(
          {
            x: Type.Number({ default: 3 }),
            y: Type.Number({ default: 4 }),
          },
          { default: {} },
        ),
      },
      { default: {} },
    )
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, { x: { x: 1, y: 2 }, y: { x: 3, y: 4 } })
  })
  it('Should should fully construct object 2', () => {
    const T = Type.Object(
      {
        x: Type.Object(
          {
            x: Type.Number({ default: 1 }),
            y: Type.Number({ default: 2 }),
          },
          { default: {} },
        ),
        y: Type.Object(
          {
            x: Type.Number({ default: 3 }),
            y: Type.Number({ default: 4 }),
          },
          { default: {} },
        ),
      },
      { default: {} },
    )
    const R = Value.Default(T, { x: null })
    Assert.IsEqual(R, { x: null, y: { x: 3, y: 4 } })
  })
  it('Should should fully construct object 3', () => {
    const T = Type.Object(
      {
        x: Type.Object(
          {
            x: Type.Number({ default: 1 }),
            y: Type.Number({ default: 2 }),
          },
          { default: {} },
        ),
        y: Type.Object(
          {
            x: Type.Number({ default: 3 }),
            y: Type.Number({ default: 4 }),
          },
          { default: {} },
        ),
      },
      { default: {} },
    )
    const R = Value.Default(T, { x: { x: null, y: null } })
    Assert.IsEqual(R, { x: { x: null, y: null }, y: { x: 3, y: 4 } })
  })
  // ----------------------------------------------------------------
  // Properties
  // ----------------------------------------------------------------
  it('Should use property defaults 1', () => {
    const T = Type.Object(
      {
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      },
      { default: 1 },
    )
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should use property defaults 2', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })
    const R = Value.Default(T, {})
    Assert.IsEqual(R, {})
  })
  it('Should use property defaults 3', () => {
    const T = Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number(),
    })
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { x: 1 })
  })
  it('Should use property defaults 4', () => {
    const T = Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number(),
    })
    const R = Value.Default(T, { x: 3 })
    Assert.IsEqual(R, { x: 3 })
  })
  // ----------------------------------------------------------------
  // AdditionalProperties
  // ----------------------------------------------------------------
  it('Should use additional property defaults 1', () => {
    const T = Type.Object(
      {
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      },
      {
        additionalProperties: Type.Number({ default: 3 }),
      },
    )
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should use additional property defaults 2', () => {
    const T = Type.Object(
      {
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      },
      {
        additionalProperties: Type.Number({ default: 3 }),
      },
    )
    const R = Value.Default(T, { x: null, y: null, z: undefined })
    Assert.IsEqual(R, { x: null, y: null, z: 3 })
  })
  it('Should use additional property defaults 3', () => {
    const T = Type.Object(
      {
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      },
      {
        additionalProperties: Type.Number(),
      },
    )
    const R = Value.Default(T, { x: null, y: null, z: undefined })
    Assert.IsEqual(R, { x: null, y: null, z: undefined })
  })
})

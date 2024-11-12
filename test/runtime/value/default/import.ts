import { Value } from '@sinclair/typebox/value'
import { Type, CloneType } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/Import', () => {
  it('Should use default', () => {
    const T = Type.Module({
      A: Type.Object(
        {
          x: Type.Number(),
          y: Type.Number(),
        },
        { default: 1 },
      ),
    }).Import('A')
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Module({
      A: Type.Object(
        {
          x: Type.Number(),
          y: Type.Number(),
        },
        { default: 1 },
      ),
    }).Import('A')
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // Construction
  // ----------------------------------------------------------------
  it('Should should fully construct object 1', () => {
    const T = Type.Module({
      A: Type.Object(
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
      ),
    }).Import('A')
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, { x: { x: 1, y: 2 }, y: { x: 3, y: 4 } })
  })
  it('Should should fully construct object 2', () => {
    const T = Type.Module({
      A: Type.Object(
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
      ),
    }).Import('A')
    const R = Value.Default(T, { x: null })
    Assert.IsEqual(R, { x: null, y: { x: 3, y: 4 } })
  })
  it('Should should fully construct object 3', () => {
    const T = Type.Module({
      A: Type.Object(
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
      ),
    }).Import('A')
    const R = Value.Default(T, { x: { x: null, y: null } })
    Assert.IsEqual(R, { x: { x: null, y: null }, y: { x: 3, y: 4 } })
  })
  // ----------------------------------------------------------------
  // Properties
  // ----------------------------------------------------------------
  it('Should use property defaults 1', () => {
    const T = Type.Module({
      A: Type.Object(
        {
          x: Type.Number({ default: 1 }),
          y: Type.Number({ default: 2 }),
        },
        { default: 1 },
      ),
    }).Import('A')
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should use property defaults 2', () => {
    const T = Type.Module({
      A: Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    }).Import('A')
    const R = Value.Default(T, {})
    Assert.IsEqual(R, {})
  })
  it('Should use property defaults 3', () => {
    const T = Type.Module({
      A: Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number(),
      }),
    }).Import('A')
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { x: 1 })
  })
  it('Should use property defaults 4', () => {
    const T = Type.Module({
      A: Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number(),
      }),
    }).Import('A')
    const R = Value.Default(T, { x: 3 })
    Assert.IsEqual(R, { x: 3 })
  })
  // ----------------------------------------------------------------
  // AdditionalProperties
  // ----------------------------------------------------------------
  it('Should use additional property defaults 1', () => {
    const T = Type.Module({
      A: Type.Object(
        {
          x: Type.Number({ default: 1 }),
          y: Type.Number({ default: 2 }),
        },
        {
          additionalProperties: Type.Number({ default: 3 }),
        },
      ),
    }).Import('A')
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should use additional property defaults 2', () => {
    const T = Type.Module({
      A: Type.Object(
        {
          x: Type.Number({ default: 1 }),
          y: Type.Number({ default: 2 }),
        },
        {
          additionalProperties: Type.Number({ default: 3 }),
        },
      ),
    }).Import('A')
    const R = Value.Default(T, { x: null, y: null, z: undefined })
    Assert.IsEqual(R, { x: null, y: null, z: 3 })
  })
  it('Should use additional property defaults 3', () => {
    const T = Type.Module({
      A: Type.Object(
        {
          x: Type.Number({ default: 1 }),
          y: Type.Number({ default: 2 }),
        },
        {
          additionalProperties: Type.Number(),
        },
      ),
    }).Import('A')
    const R = Value.Default(T, { x: null, y: null, z: undefined })
    Assert.IsEqual(R, { x: null, y: null, z: undefined })
  })
  // ----------------------------------------------------------------
  // Mutation
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/726
  it('Should retain defaults on operation', () => {
    const A = Type.Module({
      A: Type.Object({
        a: Type.Object(
          {
            b: Type.Array(Type.String(), { default: [] }),
          },
          { default: {} },
        ),
      }),
    }).Import('A')
    const value = Value.Default(A, {})
    Assert.IsEqual(value, { a: { b: [] } })
    Assert.IsEqual(A.$defs.A.properties.a.default, {})
    Assert.IsEqual(A.$defs.A.properties.a.properties.b.default, [])
  })
  // https://github.com/sinclairzx81/typebox/issues/726
  it('Should retain schematics on operation', () => {
    const A = Type.Module({
      A: Type.Object({
        a: Type.Object(
          {
            b: Type.Array(Type.String(), { default: [] }),
          },
          { default: {} },
        ),
      }),
    }).Import('A')
    const B = CloneType(A)
    Value.Default(A, {})
    Assert.IsEqual(A, B)
  })
  // ----------------------------------------------------------------
  // Traveral: https://github.com/sinclairzx81/typebox/issues/962
  // ----------------------------------------------------------------
  it('Should traverse into an object 1 (initialize)', () => {
    const M = Type.Module({
      Y: Type.Object({ y: Type.String({ default: 'y' }) }),
      X: Type.Object({ x: Type.Ref('Y') }),
    })
    const Y = M.Import('Y')
    const X = M.Import('X')
    Assert.IsEqual(Value.Default(Y, {}), { y: 'y' })
    Assert.IsEqual(Value.Default(X, { x: {} }), { x: { y: 'y' } })
  })
  it('Should traverse into an object 2 (retain)', () => {
    const M = Type.Module({
      Y: Type.Object({ y: Type.String({ default: 'y' }) }),
      X: Type.Object({ x: Type.Ref('Y') }),
    })
    const Y = M.Import('Y')
    const X = M.Import('X')
    Assert.IsEqual(Value.Default(X, { x: { y: 1 } }), { x: { y: 1 } })
  })
  it('Should traverse into an object 3 (ignore on undefined)', () => {
    const M = Type.Module({
      Y: Type.Object({ y: Type.String({ default: 'y' }) }),
      X: Type.Object({ x: Type.Ref('Y') }),
    })
    const Y = M.Import('Y')
    const X = M.Import('X')
    Assert.IsEqual(Value.Default(X, { x: undefined }), { x: undefined })
  })
  // ----------------------------------------------------------------
  // Exterior Object Defaults
  // ----------------------------------------------------------------
  it('Should default exterior into an object 1', () => {
    const X = Type.Module({ A: Type.Object({ x: Type.String({ default: 1 }) }, { default: {} }) }).Import('A')
    const R = Value.Default(X, undefined)
    Assert.IsEqual(R, { x: 1 })
  })
  it('Should default exterior into an object 2', () => {
    const X = Type.Module({ A: Type.Object({ x: Type.String({ default: 1 }) }, { default: {} }) }).Import('A')
    const R = Value.Default(X, {})
    Assert.IsEqual(R, { x: 1 })
  })
  it('Should default exterior into an object 3', () => {
    const X = Type.Module({ A: Type.Object({ x: Type.String({ default: 1 }) }, { default: {} }) }).Import('A')
    const R = Value.Default(X, { y: 3 })
    Assert.IsEqual(R, { y: 3, x: 1 })
  })
  it('Should default exterior into an object 4', () => {
    const X = Type.Module({ A: Type.Object({ x: Type.String({ default: 1 }) }, { default: {} }) }).Import('A')
    const R = Value.Default(X, { y: 3, x: 7 })
    Assert.IsEqual(R, { y: 3, x: 7 })
  })
  it('Should default exterior into an object 5', () => {
    const X = Type.Module({ A: Type.Object({ x: Type.String({ default: 1 }) }, { default: {} }) }).Import('A')
    const R = Value.Default(X, { x: 2 })
    Assert.IsEqual(R, { x: 2 })
  })
})

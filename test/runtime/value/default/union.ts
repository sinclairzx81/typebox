import { Value } from '@sinclair/typebox/value'
import { Type, Kind, TypeRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// prettier-ignore
describe('value/default/Union', () => {
  it('Should use default', () => {
    const T = Type.Union([Type.Number(), Type.String()], { default: 1 })
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Union([Type.Number(), Type.String()], { default: 1 })
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // Interior
  // ----------------------------------------------------------------
  it('Should default interior 1', () => {
    const T = Type.Union([
      Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      }),
      Type.String({ default: 'hello' }),
    ])
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  it('Should default interior 2', () => {
    const T = Type.Union([
      Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      }),
      Type.String({ default: 'hello' }),
    ])
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 'hello')
  })
  it('Should default interior 3', () => {
    const T = Type.Union([
      Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      }),
      Type.String({ default: 'hello' }),
    ])
    const R = Value.Default(T, 'world')
    Assert.IsEqual(R, 'world')
  })
  it('Should default interior 4', () => {
    const T = Type.Union([
      Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      }),
      Type.String({ default: 'hello' }),
    ])
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should default interior 5', () => {
    const T = Type.Union([
      Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      }),
      Type.String({ default: 'hello' }),
    ])
    const R = Value.Default(T, { x: 3 })
    Assert.IsEqual(R, { x: 3, y: 2 })
  })
  it('Should default interior 6', () => {
    const T = Type.Union([
      Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      }),
      Type.String({ default: 'hello' }),
    ])
    const R = Value.Default(T, { x: 3, y: 4 })
    Assert.IsEqual(R, { x: 3, y: 4 })
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/993
  // ----------------------------------------------------------------
  it('Should return the original value if no schemas match (cloned interior variant)', async () => {
    const T = Type.Union([
      Type.Tuple([Type.Number(), Type.Number()]), 
      Type.Array(Type.Number())
    ])
    const value = ['hello']
    const R = Value.Default(T, value)
    Assert.IsTrue(R === value)
  })
  // ----------------------------------------------------------------
  // Interior Unsafe
  // ----------------------------------------------------------------
  it('Should default interior unsafe 1', () => {
    TypeRegistry.Set('DefaultUnsafe', (schema, value) => typeof value === 'string')
    const T = Type.Union([
      Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      }),
      Type.Unsafe({ [Kind]: 'DefaultUnsafe', default: 'hello' }),
    ])
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 'hello')
    TypeRegistry.Delete('DefaultUnsafe')
  })
  it('Should default interior unsafe 2', () => {
    TypeRegistry.Set('DefaultUnsafe', (schema, value) => typeof value === 'string')
    const T = Type.Union([
      Type.Object({
        x: Type.Number({ default: 1 }),
        y: Type.Number({ default: 2 }),
      }),
      Type.Unsafe({ [Kind]: 'DefaultUnsafe', default: 'hello' }),
    ])
    const R = Value.Default(T, 'world')
    Assert.IsEqual(R, 'world')
    TypeRegistry.Delete('DefaultUnsafe')
  })
})

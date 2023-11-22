import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/Record', () => {
  it('Should use default', () => {
    const T = Type.Record(Type.String(), Type.Number(), { default: 1 })
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Record(Type.String(), Type.Number(), { default: 1 })
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // // ----------------------------------------------------------------
  // // Properties
  // // ----------------------------------------------------------------
  it('Should use property defaults 1', () => {
    const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
    const R = Value.Default(T, { 0: undefined })
    Assert.IsEqual(R, { 0: 1 })
  })
  it('Should use property defaults 2', () => {
    const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
    const R = Value.Default(T, { 0: null })
    Assert.IsEqual(R, { 0: null })
  })
  it('Should use property defaults 3', () => {
    const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
    const R = Value.Default(T, { a: undefined })
    Assert.IsEqual(R, { a: undefined })
  })
  it('Should use property defaults 4', () => {
    const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
    const R = Value.Default(T, { 0: undefined })
    Assert.IsEqual(R, { 0: 1 })
  })
  it('Should use property defaults 5', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    const R = Value.Default(T, { 0: undefined })
    Assert.IsEqual(R, { 0: undefined })
  })
  it('Should use property defaults 6', () => {
    const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
    const R = Value.Default(T, {})
    Assert.IsEqual(R, {})
  })
  // ----------------------------------------------------------------
  // Additional Properties
  // ----------------------------------------------------------------
  it('Should use additional property defaults 1', () => {
    const T = Type.Record(Type.Number(), Type.Number({ default: 1 }), {
      additionalProperties: Type.Number({ default: 3 }),
    })
    const R = Value.Default(T, { 0: undefined, a: undefined })
    Assert.IsEqual(R, { 0: 1, a: 3 })
  })
  it('Should use additional property defaults 2', () => {
    const T = Type.Record(Type.Number(), Type.Number({ default: 1 }), {
      additionalProperties: Type.Number(),
    })
    const R = Value.Default(T, { 0: undefined, a: undefined })
    Assert.IsEqual(R, { 0: 1, a: undefined })
  })
})

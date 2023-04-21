import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Record', () => {
  it('Should pass record', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    const value = {
      position: {
        x: 1,
        y: 2,
        z: 3,
      },
    }
    const result = Value.Check(T, value)
    Assert.isEqual(result, true)
  })
  it('Should fail when below minProperties', () => {
    const T = Type.Record(Type.String(), Type.Number(), { minProperties: 4 })
    Assert.isEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4 }), true)
    Assert.isEqual(Value.Check(T, { a: 1, b: 2, c: 3 }), false)
  })
  it('Should fail when above maxProperties', () => {
    const T = Type.Record(Type.String(), Type.Number(), { maxProperties: 4 })
    Assert.isEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4 }), true)
    Assert.isEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4, e: 5 }), false)
  })
  it('Should fail with illogical minProperties | maxProperties', () => {
    const T = Type.Record(Type.String(), Type.Number(), { minProperties: 5, maxProperties: 4 })
    Assert.isEqual(Value.Check(T, { a: 1, b: 2, c: 3 }), false)
    Assert.isEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4 }), false)
    Assert.isEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4, e: 5 }), false)
  })
  it('Should fail record with Date', () => {
    const T = Type.Record(Type.String(), Type.String())
    const result = Value.Check(T, new Date())
    Assert.isEqual(result, false)
  })
  it('Should fail record with Uint8Array', () => {
    const T = Type.Record(Type.String(), Type.String())
    const result = Value.Check(T, new Uint8Array())
    Assert.isEqual(result, false)
  })
  it('Should fail record with missing property', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    const value = {
      position: {
        x: 1,
        y: 2,
      },
    }
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  it('Should fail record with invalid property', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    const value = {
      position: {
        x: 1,
        y: 2,
        z: '3',
      },
    }
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  it('Should pass record with optional property', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Optional(Type.Number()),
      }),
    )
    const value = {
      position: {
        x: 1,
        y: 2,
      },
    }
    const result = Value.Check(T, value)
    Assert.isEqual(result, true)
  })
  it('Should pass record with optional property', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Optional(Type.Number()),
      }),
    )
    const value = {
      position: {
        x: 1,
        y: 2,
      },
    }
    const result = Value.Check(T, value)
    Assert.isEqual(result, true)
  })
  // -------------------------------------------------
  // Number Key
  // -------------------------------------------------
  it('Should pass record with number key', () => {
    const T = Type.Record(Type.Number(), Type.String())
    const value = {
      0: 'a',
      1: 'a',
      2: 'a',
    }
    const result = Value.Check(T, value)
    Assert.isEqual(result, true)
  })

  it('Should not pass record with invalid number key', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
    const value = {
      a: 'a',
      1: 'a',
      2: 'a',
    }
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  // -------------------------------------------------
  // Integer Key
  // -------------------------------------------------
  it('Should pass record with integer key', () => {
    const T = Type.Record(Type.Integer(), Type.String())
    const value = {
      0: 'a',
      1: 'a',
      2: 'a',
    }
    const result = Value.Check(T, value)
    Assert.isEqual(result, true)
  })
  it('Should not pass record with invalid integer key', () => {
    const T = Type.Record(Type.Integer(), Type.String(), { additionalProperties: false })
    const value = {
      a: 'a',
      1: 'a',
      2: 'a',
    }
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  // ------------------------------------------------------------
  // AdditionalProperties
  // ------------------------------------------------------------
  it('AdditionalProperties 1', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: true })
    const R = Value.Check(T, { 1: '', 2: '', x: 1, y: 2, z: 3 })
    Assert.isEqual(R, true)
  })
  it('AdditionalProperties 2', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
    const R = Value.Check(T, { 1: '', 2: '', 3: '' })
    Assert.isEqual(R, true)
  })
  it('AdditionalProperties 3', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
    const R = Value.Check(T, { 1: '', 2: '', x: '' })
    Assert.isEqual(R, false)
  })
  it('AdditionalProperties 4', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: Type.Boolean() })
    const R = Value.Check(T, { 1: '', 2: '', x: '' })
    Assert.isEqual(R, false)
  })
  it('AdditionalProperties 5', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: Type.Boolean() })
    const R = Value.Check(T, { 1: '', 2: '', x: true })
    Assert.isEqual(R, true)
  })
})

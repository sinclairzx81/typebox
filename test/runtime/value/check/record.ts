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
    Assert.IsEqual(result, true)
  })
  it('Should fail when below minProperties', () => {
    const T = Type.Record(Type.String(), Type.Number(), { minProperties: 4 })
    Assert.IsEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4 }), true)
    Assert.IsEqual(Value.Check(T, { a: 1, b: 2, c: 3 }), false)
  })
  it('Should fail when above maxProperties', () => {
    const T = Type.Record(Type.String(), Type.Number(), { maxProperties: 4 })
    Assert.IsEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4 }), true)
    Assert.IsEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4, e: 5 }), false)
  })
  it('Should fail with illogical minProperties | maxProperties', () => {
    const T = Type.Record(Type.String(), Type.Number(), { minProperties: 5, maxProperties: 4 })
    Assert.IsEqual(Value.Check(T, { a: 1, b: 2, c: 3 }), false)
    Assert.IsEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4 }), false)
    Assert.IsEqual(Value.Check(T, { a: 1, b: 2, c: 3, d: 4, e: 5 }), false)
  })
  it('Should fail record with Date', () => {
    const T = Type.Record(Type.String(), Type.String())
    const result = Value.Check(T, new Date())
    Assert.IsEqual(result, false)
  })
  it('Should fail record with Uint8Array', () => {
    const T = Type.Record(Type.String(), Type.String())
    const result = Value.Check(T, new Uint8Array())
    Assert.IsEqual(result, false)
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
    Assert.IsEqual(result, false)
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
    Assert.IsEqual(result, false)
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
    Assert.IsEqual(result, true)
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
    Assert.IsEqual(result, true)
  })
  it('Should validate when specifying regular expressions', () => {
    const K = Type.RegExp(/^op_.*$/)
    const T = Type.Record(K, Type.Number())
    const R = Value.Check(T, {
      op_a: 1,
      op_b: 2,
      op_c: 3,
    })
    Assert.IsTrue(R)
  })
  it('Should not validate when specifying regular expressions and passing invalid property', () => {
    const K = Type.RegExp(/^op_.*$/)
    const T = Type.Record(K, Type.Number(), { additionalProperties: false })
    const R = Value.Check(T, {
      op_a: 1,
      op_b: 2,
      aop_c: 3,
    })
    Assert.IsFalse(R)
  })
  it('Should validate with quoted string pattern', () => {
    const K = Type.String({ pattern: "'(a|b|c)" })
    const T = Type.Record(K, Type.Number())
    const R = Value.Check(T, {
      "'a": 1,
      "'b": 2,
      "'c": 3,
    })
    Assert.IsTrue(R)
  })
  it('Should validate with forward-slash pattern', () => {
    const K = Type.String({ pattern: '/(a|b|c)' })
    const T = Type.Record(K, Type.Number())
    const R = Value.Check(T, {
      '/a': 1,
      '/b': 2,
      '/c': 3,
    })
    Assert.IsTrue(R)
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
    Assert.IsEqual(result, true)
  })

  it('Should not pass record with invalid number key', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
    const value = {
      a: 'a',
      1: 'a',
      2: 'a',
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
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
    Assert.IsEqual(result, true)
  })
  it('Should not pass record with invalid integer key', () => {
    const T = Type.Record(Type.Integer(), Type.String(), { additionalProperties: false })
    const value = {
      a: 'a',
      1: 'a',
      2: 'a',
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  // ------------------------------------------------------------
  // AdditionalProperties
  // ------------------------------------------------------------
  it('AdditionalProperties 1', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: true })
    const R = Value.Check(T, { 1: '', 2: '', x: 1, y: 2, z: 3 })
    Assert.IsEqual(R, true)
  })
  it('AdditionalProperties 2', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
    const R = Value.Check(T, { 1: '', 2: '', 3: '' })
    Assert.IsEqual(R, true)
  })
  it('AdditionalProperties 3', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
    const R = Value.Check(T, { 1: '', 2: '', x: '' })
    Assert.IsEqual(R, false)
  })
  it('AdditionalProperties 4', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: Type.Boolean() })
    const R = Value.Check(T, { 1: '', 2: '', x: '' })
    Assert.IsEqual(R, false)
  })
  it('AdditionalProperties 5', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: Type.Boolean() })
    const R = Value.Check(T, { 1: '', 2: '', x: true })
    Assert.IsEqual(R, true)
  })
})

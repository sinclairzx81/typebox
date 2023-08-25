import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler/Record', () => {
  // -------------------------------------------------------------
  // Issues
  // -------------------------------------------------------------
  it('Issue: https://github.com/sinclairzx81/typebox/issues/402', () => {
    const T = Type.Object({
      foo: Type.Object({
        bar: Type.Record(Type.String(), Type.Number()),
      }),
    })
    Ok(T, { foo: { bar: { x: 42 } } })
    Ok(T, { foo: { bar: {} } })
    Fail(T, { foo: { bar: { x: '42' } } })
    Fail(T, { foo: { bar: [] } })
    Fail(T, { foo: {} })
    Fail(T, { foo: [] })
    Fail(T, {})
  })
  // -------------------------------------------------------------
  // TypeBox Only: Date and Record
  // -------------------------------------------------------------
  it('Should fail record with Date', () => {
    const T = Type.Record(Type.String(), Type.String())
    Fail(T, new Date())
  })
  it('Should fail record with Uint8Array', () => {
    const T = Type.Record(Type.String(), Type.String())
    Fail(T, new Uint8Array())
  })
  // -------------------------------------------------------------
  // Standard Assertions
  // -------------------------------------------------------------
  it('Should validate when all property values are numbers', () => {
    const T = Type.Record(Type.String(), Type.Number())
    Ok(T, { a: 1, b: 2, c: 3 })
  })
  it('Should validate when all property keys are strings', () => {
    const T = Type.Record(Type.String(), Type.Number())
    Ok(T, { a: 1, b: 2, c: 3, '0': 4 })
  })
  it('Should not validate when below minProperties', () => {
    const T = Type.Record(Type.String(), Type.Number(), { minProperties: 4 })
    Ok(T, { a: 1, b: 2, c: 3, d: 4 })
    Fail(T, { a: 1, b: 2, c: 3 })
  })
  it('Should not validate when above maxProperties', () => {
    const T = Type.Record(Type.String(), Type.Number(), { maxProperties: 4 })
    Ok(T, { a: 1, b: 2, c: 3, d: 4 })
    Fail(T, { a: 1, b: 2, c: 3, d: 4, e: 5 })
  })
  it('Should not validate with illogical minProperties | maxProperties', () => {
    const T = Type.Record(Type.String(), Type.Number(), { minProperties: 5, maxProperties: 4 })
    Fail(T, { a: 1, b: 2, c: 3 })
    Fail(T, { a: 1, b: 2, c: 3, d: 4 })
    Fail(T, { a: 1, b: 2, c: 3, d: 4, e: 5 })
  })
  it('Should validate when specifying string union literals when additionalProperties is true', () => {
    const K = Type.Union([Type.Literal('a'), Type.Literal('b'), Type.Literal('c')])
    const T = Type.Record(K, Type.Number())
    Ok(T, { a: 1, b: 2, c: 3, d: 'hello' })
  })
  it('Should not validate when specifying string union literals when additionalProperties is false', () => {
    const K = Type.Union([Type.Literal('a'), Type.Literal('b'), Type.Literal('c')])
    const T = Type.Record(K, Type.Number(), { additionalProperties: false })
    Fail(T, { a: 1, b: 2, c: 3, d: 'hello' })
  })
  it('Should validate for keyof records', () => {
    const T = Type.Object({
      a: Type.String(),
      b: Type.Number(),
      c: Type.String(),
    })
    const R = Type.Record(Type.KeyOf(T), Type.Number())
    Ok(R, { a: 1, b: 2, c: 3 })
  })
  it('Should not validate for unknown key via keyof', () => {
    const T = Type.Object({
      a: Type.String(),
      b: Type.Number(),
      c: Type.String(),
    })
    const R = Type.Record(Type.KeyOf(T), Type.Number(), { additionalProperties: false })
    Fail(R, { a: 1, b: 2, c: 3, d: 4 })
  })
  it('Should validate when specifying regular expressions', () => {
    const K = Type.RegExp(/^op_.*$/)
    const T = Type.Record(K, Type.Number())
    Ok(T, {
      op_a: 1,
      op_b: 2,
      op_c: 3,
    })
  })
  it('Should not validate when specifying regular expressions and passing invalid property', () => {
    const K = Type.RegExp(/^op_.*$/)
    const T = Type.Record(K, Type.Number(), { additionalProperties: false })
    Fail(T, {
      op_a: 1,
      op_b: 2,
      aop_c: 3,
    })
  })
  it('Should validate with quoted string pattern', () => {
    const K = Type.String({ pattern: "'(a|b|c)" })
    const T = Type.Record(K, Type.Number())
    Ok(T, {
      "'a": 1,
      "'b": 2,
      "'c": 3,
    })
  })
  it('Should validate with forward-slash pattern', () => {
    const K = Type.String({ pattern: '/(a|b|c)' })
    const T = Type.Record(K, Type.Number())
    Ok(T, {
      '/a': 1,
      '/b': 2,
      '/c': 3,
    })
  })
  // ------------------------------------------------------------
  // Integer Keys
  // ------------------------------------------------------------
  it('Should validate when all property keys are integers', () => {
    const T = Type.Record(Type.Integer(), Type.Number())
    Ok(T, { '0': 1, '1': 2, '2': 3, '3': 4 })
  })
  it('Should validate when all property keys are integers, but one property is a string with varying type', () => {
    const T = Type.Record(Type.Integer(), Type.Number(), { additionalProperties: false })
    Fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
  })
  it('Should not validate if passing a leading zeros for integers keys', () => {
    const T = Type.Record(Type.Integer(), Type.Number(), { additionalProperties: false })
    Fail(T, {
      '00': 1,
      '01': 2,
      '02': 3,
      '03': 4,
    })
  })
  it('Should not validate if passing a signed integers keys', () => {
    const T = Type.Record(Type.Integer(), Type.Number(), { additionalProperties: false })
    Fail(T, {
      '-0': 1,
      '-1': 2,
      '-2': 3,
      '-3': 4,
    })
  })
  // ------------------------------------------------------------
  // Number Keys
  // ------------------------------------------------------------
  it('Should validate when all property keys are numbers', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    Ok(T, { '0': 1, '1': 2, '2': 3, '3': 4 })
  })
  it('Should validate when all property keys are numbers, but one property is a string with varying type', () => {
    const T = Type.Record(Type.Number(), Type.Number(), { additionalProperties: false })
    Fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
  })
  it('Should not validate if passing a leading zeros for numeric keys', () => {
    const T = Type.Record(Type.Number(), Type.Number(), { additionalProperties: false })
    Fail(T, {
      '00': 1,
      '01': 2,
      '02': 3,
      '03': 4,
    })
  })
  it('Should not validate if passing a signed numeric keys', () => {
    const T = Type.Record(Type.Number(), Type.Number(), { additionalProperties: false })
    Fail(T, {
      '-0': 1,
      '-1': 2,
      '-2': 3,
      '-3': 4,
    })
  })
  it('Should not validate when all property keys are numbers, but one property is a string with varying type', () => {
    const T = Type.Record(Type.Number(), Type.Number(), { additionalProperties: false })
    Fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
  })
  // ------------------------------------------------------------
  // AdditionalProperties
  // ------------------------------------------------------------
  it('AdditionalProperties 1', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: true })
    Ok(T, { 1: '', 2: '', x: 1, y: 2, z: 3 })
  })
  it('AdditionalProperties 2', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
    Ok(T, { 1: '', 2: '', 3: '' })
  })
  it('AdditionalProperties 3', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
    Fail(T, { 1: '', 2: '', x: '' })
  })
  it('AdditionalProperties 4', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: Type.Boolean() })
    Fail(T, { 1: '', 2: '', x: '' })
  })
  it('AdditionalProperties 5', () => {
    const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: Type.Boolean() })
    Ok(T, { 1: '', 2: '', x: true })
  })
})

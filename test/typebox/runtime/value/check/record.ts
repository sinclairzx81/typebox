import { Type } from 'typebox'
import { Fail, Ok } from './~validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Record')

// -------------------------------------------------------------
// Issues
// -------------------------------------------------------------
Test('Issue: https://github.com/sinclairzx81/typebox/issues/402', () => {
  const T = Type.Object({
    foo: Type.Object({
      bar: Type.Record(Type.String(), Type.Number())
    })
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
Test('Should pass record with Date', () => {
  const T = Type.Record(Type.String(), Type.String())
  Ok(T, new Date())
})
Test('Should pass record with Uint8Array', () => {
  const T = Type.Record(Type.String(), Type.String())
  Ok(T, new Uint8Array())
})
// -------------------------------------------------------------
// Standard Assertions
// -------------------------------------------------------------
Test('Should validate when all property values are numbers', () => {
  const T = Type.Record(Type.String(), Type.Number())
  Ok(T, { a: 1, b: 2, c: 3 })
})
Test('Should validate when all property keys are strings', () => {
  const T = Type.Record(Type.String(), Type.Number())
  Ok(T, { a: 1, b: 2, c: 3, '0': 4 })
})
Test('Should not validate when below minProperties', () => {
  const T = Type.Record(Type.String(), Type.Number(), { minProperties: 4 })
  Ok(T, { a: 1, b: 2, c: 3, d: 4 })
  Fail(T, { a: 1, b: 2, c: 3 })
})
Test('Should not validate when above maxProperties', () => {
  const T = Type.Record(Type.String(), Type.Number(), { maxProperties: 4 })
  Ok(T, { a: 1, b: 2, c: 3, d: 4 })
  Fail(T, { a: 1, b: 2, c: 3, d: 4, e: 5 })
})
Test('Should not validate with illogical minProperties | maxProperties', () => {
  const T = Type.Record(Type.String(), Type.Number(), { minProperties: 5, maxProperties: 4 })
  Fail(T, { a: 1, b: 2, c: 3 })
  Fail(T, { a: 1, b: 2, c: 3, d: 4 })
  Fail(T, { a: 1, b: 2, c: 3, d: 4, e: 5 })
})
Test('Should validate when specifying string union literals when additionalProperties is true', () => {
  const K = Type.Union([Type.Literal('a'), Type.Literal('b'), Type.Literal('c')])
  const T = Type.Record(K, Type.Number())
  Ok(T, { a: 1, b: 2, c: 3, d: 'hello' })
})
Test('Should not validate when specifying string union literals when additionalProperties is false', () => {
  const K = Type.Union([Type.Literal('a'), Type.Literal('b'), Type.Literal('c')])
  const T = Type.Record(K, Type.Number(), { additionalProperties: false })
  Fail(T, { a: 1, b: 2, c: 3, d: 'hello' })
})
Test('Should validate for keyof records', () => {
  const T = Type.Object({
    a: Type.String(),
    b: Type.Number(),
    c: Type.String()
  })
  const R = Type.Record(Type.KeyOf(T), Type.Number())
  Ok(R, { a: 1, b: 2, c: 3 })
})
Test('Should not validate for unknown key via keyof', () => {
  const T = Type.Object({
    a: Type.String(),
    b: Type.Number(),
    c: Type.String()
  })
  const R = Type.Record(Type.KeyOf(T), Type.Number(), { additionalProperties: false })
  Fail(R, { a: 1, b: 2, c: 3, d: 4 })
})
Test('Should validate when specifying regular expressions', () => {
  const K = Type.String({ pattern: /^op_.*$/ })
  const T = Type.Record(K, Type.Number())
  Ok(T, {
    op_a: 1,
    op_b: 2,
    op_c: 3
  })
})
Test('Should not validate when specifying regular expressions and passing invalid property', () => {
  const K = Type.String({ pattern: /^op_.*$/ })
  const T = Type.Record(K, Type.Number(), { additionalProperties: false })
  Fail(T, {
    op_a: 1,
    op_b: 2,
    aop_c: 3
  })
})
Test('Should validate with quoted string pattern', () => {
  const K = Type.String({ pattern: "'(a|b|c)" })
  const T = Type.Record(K, Type.Number())
  Ok(T, {
    "'a": 1,
    "'b": 2,
    "'c": 3
  })
})
Test('Should validate with forward-slash pattern', () => {
  const K = Type.String({ pattern: '/(a|b|c)' })
  const T = Type.Record(K, Type.Number())
  Ok(T, {
    '/a': 1,
    '/b': 2,
    '/c': 3
  })
})
// ------------------------------------------------------------
// Integer Keys
// ------------------------------------------------------------
Test('Should validate when all property keys are integers', () => {
  const T = Type.Record(Type.Integer(), Type.Number())
  Ok(T, { '0': 1, '1': 2, '2': 3, '3': 4 })
})
Test('Should validate when all property keys are integers, but one property is a string with varying type', () => {
  const T = Type.Record(Type.Integer(), Type.Number(), { additionalProperties: false })
  Fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
})
Test('Should not validate if passing a leading zeros for integers keys', () => {
  const T = Type.Record(Type.Integer(), Type.Number(), { additionalProperties: false })
  Fail(T, {
    '00': 1,
    '01': 2,
    '02': 3,
    '03': 4
  })
})
Test('Should validate if passing a signed integers keys', () => {
  const T = Type.Record(Type.Integer(), Type.Number(), { additionalProperties: false })
  Ok(T, {
    '-0': 1,
    '-1': 2,
    '-2': 3,
    '-3': 4
  })
})
// ------------------------------------------------------------
// Number Keys
// ------------------------------------------------------------
Test('Should validate when all property keys are numbers', () => {
  const T = Type.Record(Type.Number(), Type.Number())
  Ok(T, { '0': 1, '1': 2, '2': 3, '3': 4 })
})
Test('Should validate when all property keys are numbers, but one property is a string with varying type', () => {
  const T = Type.Record(Type.Number(), Type.Number(), { additionalProperties: false })
  Fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
})
Test('Should not validate if passing a leading zeros for numeric keys', () => {
  const T = Type.Record(Type.Number(), Type.Number(), { additionalProperties: false })
  Fail(T, {
    '00': 1,
    '01': 2,
    '02': 3,
    '03': 4
  })
})
Test('Should validate signed numeric keys', () => {
  const T = Type.Record(Type.Number(), Type.Number(), { additionalProperties: false })
  Ok(T, {
    '-0': 1,
    '-1': 2,
    '-2': 3,
    '-3': 4
  })
})
Test('Should not validate when all property keys are numbers, but one property is a string with varying type', () => {
  const T = Type.Record(Type.Number(), Type.Number(), { additionalProperties: false })
  Fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
})
// ------------------------------------------------------------
// AdditionalProperties
// ------------------------------------------------------------
Test('AdditionalProperties 1', () => {
  const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: true })
  Ok(T, { 1: '', 2: '', x: 1, y: 2, z: 3 })
})
Test('AdditionalProperties 2', () => {
  const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
  Ok(T, { 1: '', 2: '', 3: '' })
})
Test('AdditionalProperties 3', () => {
  const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: false })
  Fail(T, { 1: '', 2: '', x: '' })
})
Test('AdditionalProperties 4', () => {
  const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: Type.Boolean() })
  Fail(T, { 1: '', 2: '', x: '' })
})
Test('AdditionalProperties 5', () => {
  const T = Type.Record(Type.Number(), Type.String(), { additionalProperties: Type.Boolean() })
  Ok(T, { 1: '', 2: '', x: true })
})
// ----------------------------------------------------------------
// TemplateLiteral
// ----------------------------------------------------------------
Test('TemplateLiteral 1', () => {
  const K = Type.TemplateLiteral('key${number}')
  const R = Type.Record(K, Type.Number(), { additionalProperties: false })
  Ok(R, {
    key0: 1,
    key1: 1,
    key2: 1
  })
})
Test('TemplateLiteral 2', () => {
  const K = Type.TemplateLiteral('key${number}')
  const R = Type.Record(K, Type.Number())
  Ok(R, { keyA: 0 })
})
Test('TemplateLiteral 3', () => {
  const K = Type.TemplateLiteral('key${number}')
  const R = Type.Record(K, Type.Number(), { additionalProperties: false })
  Fail(R, { keyA: 0 })
})
Test('TemplateLiteral 4', () => {
  const K = Type.TemplateLiteral('key${number}')
  const R = Type.Record(K, Type.Number())
  const T = Type.Object({ x: Type.Number(), y: Type.Number() })
  const I = Type.Intersect([R, T], { unevaluatedProperties: false })
  Ok(I, {
    x: 1,
    y: 2,
    key0: 1,
    key1: 1,
    key2: 1
  })
})
Test('TemplateLiteral 5', () => {
  const K = Type.TemplateLiteral('key${number}')
  const R = Type.Record(K, Type.Number())
  const T = Type.Object({ x: Type.Number(), y: Type.Number() })
  const I = Type.Intersect([R, T])
  Ok(I, {
    x: 1,
    y: 2,
    z: 3,
    key0: 1,
    key1: 1,
    key2: 1
  })
})
Test('TemplateLiteral 6', () => {
  const K = Type.TemplateLiteral('key${number}')
  const R = Type.Record(K, Type.Number())
  const T = Type.Object({ x: Type.Number(), y: Type.Number() })
  const I = Type.Intersect([R, T], { unevaluatedProperties: false })
  Fail(I, {
    x: 1,
    y: 2,
    z: 3,
    key0: 1,
    key1: 1,
    key2: 1
  })
})
// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/916
// ----------------------------------------------------------------
Test('Should validate for string keys', () => {
  const T = Type.Record(Type.String(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, {
    a: null,
    b: null,
    0: null,
    1: null
  })
})
Test('Should validate for number keys', () => {
  const T = Type.Record(Type.Number(), Type.Null(), {
    additionalProperties: false
  })
  Fail(T, {
    a: null,
    b: null,
    0: null,
    1: null
  })
  Ok(T, {
    0: null,
    1: null
  })
})
Test('Should validate for any keys', () => {
  const T = Type.Record(Type.Any(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, {
    a: null,
    b: null,
    0: null,
    1: null
  })
})
Test('Should validate for never keys', () => {
  const T = Type.Record(Type.Never(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, {})
  Fail(T, {
    a: null,
    b: null,
    0: null,
    1: null
  })
})
// ------------------------------------------------------------------
// NumericPattern via TemplateLiteral
// ------------------------------------------------------------------
Test('Should handle NumericPattern 1', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 0: null })
  Fail(T, { '0x1': null })
})
Test('Should handle NumericPattern 2', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 1: null })
  Fail(T, { '1x5': null })
})
Test('Should handle NumericPattern 3', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '-1': null })
  Fail(T, { '-1x': null })
})
Test('Should handle NumericPattern 4', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '1.5': null })
  Fail(T, { '1x5': null })
})
Test('Should handle NumericPattern 5', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '-1.5': null })
  Fail(T, { '1.': null })
})
// ------------------------------------------------------------------
// NumericPattern via TemplateLiteral (Prefix)
// ------------------------------------------------------------------
Test('Should handle TemplateLiteral Prefix 1', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A0': null })
  Fail(T, { 'A0x1': null })
})
Test('Should handle TemplateLiteral Prefix 2', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A1': null })
  Fail(T, { 'A1x5': null })
})
Test('Should handle TemplateLiteral Prefix 3', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A-1': null })
  Fail(T, { 'A-1x': null })
})
Test('Should handle TemplateLiteral Prefix 4', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A1.5': null })
  Fail(T, { 'A1x5': null })
})
Test('Should handle TemplateLiteral Prefix 5', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A-1.5': null })
  Fail(T, { 'A1.': null })
})
// ------------------------------------------------------------------
// NumericPattern via TemplateLiteral (Postfix)
// ------------------------------------------------------------------
Test('Should handle TemplateLiteral Postfix 1', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '0Z': null })
  Fail(T, { '0x1Z': null })
})
Test('Should handle TemplateLiteral Postfix 2', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '1Z': null })
  Fail(T, { '1x5Z': null })
})
Test('Should handle TemplateLiteral Postfix 3', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '-1Z': null })
  Fail(T, { '-1xZ': null })
})
Test('Should handle TemplateLiteral Postfix 4', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '1.5Z': null })
  Fail(T, { '1x5Z': null })
})
Test('Should handle TemplateLiteral Postfix 5', () => {
  const T = Type.Record(Type.TemplateLiteral('${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '-1.5Z': null })
  Fail(T, { '1.Z': null })
})
// ------------------------------------------------------------------
// NumericPattern via TemplateLiteral (Prefix + Postfix)
// ------------------------------------------------------------------
Test('Should handle TemplateLiteral Prefix + Postfix 1', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A0Z': null })
  Fail(T, { 'A0x1Z': null })
})
Test('Should handle TemplateLiteral Prefix + Postfix 2', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A1Z': null })
  Fail(T, { 'A1x5Z': null })
})
Test('Should handle TemplateLiteral Prefix + Postfix 3', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A-1Z': null })
  Fail(T, { 'A-1xZ': null })
})
Test('Should handle TemplateLiteral Prefix + Postfix 4', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A1.5Z': null })
  Fail(T, { 'A1x5Z': null })
})
Test('Should handle TemplateLiteral Prefix + Postfix 5', () => {
  const T = Type.Record(Type.TemplateLiteral('A${number}Z'), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 'A-1.5Z': null })
  Fail(T, { 'A1.Z': null })
})
// ------------------------------------------------------------------
// NumericPattern
// ------------------------------------------------------------------
Test('Should handle NumericPattern 1', () => {
  const T = Type.Record(Type.Number(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 0: null })
  Fail(T, { '0x1': null })
})
Test('Should handle NumericPattern 2', () => {
  const T = Type.Record(Type.Number(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 1: null })
  Fail(T, { '1x5': null })
})
Test('Should handle NumericPattern 3', () => {
  const T = Type.Record(Type.Number(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '-1': null })
  Fail(T, { '-1x': null })
})
Test('Should handle NumericPattern 4', () => {
  const T = Type.Record(Type.Number(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '1.5': null })
  Fail(T, { '1x5': null })
})
Test('Should handle NumericPattern 5', () => {
  const T = Type.Record(Type.Number(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '-1.5': null })
  Fail(T, { '1.': null })
})
// ------------------------------------------------------------------
// IntegerPattern
// ------------------------------------------------------------------
Test('Should handle IntegerPattern 1', () => {
  const T = Type.Record(Type.Integer(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 0: null })
  Fail(T, { '0x1': null })
})

Test('Should handle IntegerPattern 2', () => {
  const T = Type.Record(Type.Integer(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 1: null })
  Fail(T, { '1x5': null })
})

Test('Should handle IntegerPattern 3', () => {
  const T = Type.Record(Type.Integer(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '-1': null })
  Fail(T, { '-1x': null })
})

Test('Should handle IntegerPattern 4', () => {
  const T = Type.Record(Type.Integer(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { 100: null })
  Fail(T, { '1.5': null })
})

Test('Should handle IntegerPattern 5', () => {
  const T = Type.Record(Type.Integer(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '-100': null })
  Fail(T, { '01': null })
})
// ------------------------------------------------------------------
// StringPattern (^.*$)
// ------------------------------------------------------------------
Test('Should handle StringPattern 1', () => {
  const T = Type.Record(Type.String(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '': null })
  Ok(T, { 'hello': null })
})
Test('Should handle StringPattern 2', () => {
  const T = Type.Record(Type.String(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { ' ': null })
  Ok(T, { 'hello world': null })
})
Test('Should handle StringPattern 3', () => {
  const T = Type.Record(Type.String(), Type.Null(), {
    additionalProperties: false
  })
  Ok(T, { '🎉': null })
  Ok(T, { '🎉🎉🎉': null })
})

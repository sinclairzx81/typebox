import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/schema/Record', () => {
  it('Should validate when all property values are numbers', () => {
    const T = Type.Record(Type.String(), Type.Number())
    ok(T, { a: 1, b: 2, c: 3 })
  })

  it('Should validate when all property keys are strings', () => {
    const T = Type.Record(Type.String(), Type.Number())
    ok(T, { a: 1, b: 2, c: 3, '0': 4 })
  })

  it('Should validate when all property keys are numbers', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    ok(T, { '0': 1, '1': 2, '2': 3, '3': 4 })
  })

  it('Should validate when all property keys are numbers, but one property is a string with varying type', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
  })

  it('Should not validate if passing a leading zeros for numeric keys', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    fail(T, {
      '00': 1,
      '01': 2,
      '02': 3,
      '03': 4,
    })
  })

  it('Should not validate if passing a signed numeric keys', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    fail(T, {
      '-0': 1,
      '-1': 2,
      '-2': 3,
      '-3': 4,
    })
  })

  it('Should not validate when all property keys are numbers, but one property is a string with varying type', () => {
    const T = Type.Record(Type.Number(), Type.Number())
    fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, a: 'hello' })
  })

  it('Should validate when specifying string union literals when additionalProperties is true', () => {
    const K = Type.Union([Type.Literal('a'), Type.Literal('b'), Type.Literal('c')])
    const T = Type.Record(K, Type.Number())
    ok(T, { a: 1, b: 2, c: 3, d: 'hello' })
  })

  it('Should not validate when specifying string union literals when additionalProperties is false', () => {
    const K = Type.Union([Type.Literal('a'), Type.Literal('b'), Type.Literal('c')])
    const T = Type.Record(K, Type.Number(), { additionalProperties: false })
    fail(T, { a: 1, b: 2, c: 3, d: 'hello' })
  })

  it('Should validate for keyof records', () => {
    const T = Type.Object({
      a: Type.String(),
      b: Type.Number(),
      c: Type.String(),
    })
    const R = Type.Record(Type.KeyOf(T), Type.Number())
    ok(R, { a: 1, b: 2, c: 3 })
  })

  it('Should not validate for unknown key via keyof', () => {
    const T = Type.Object({
      a: Type.String(),
      b: Type.Number(),
      c: Type.String(),
    })
    const R = Type.Record(Type.KeyOf(T), Type.Number(), { additionalProperties: false })
    fail(R, { a: 1, b: 2, c: 3, d: 4 })
  })

  it('Should should validate when specifying regular expressions', () => {
    const K = Type.RegEx(/^op_.*$/)
    const T = Type.Record(K, Type.Number())
    ok(T, {
      op_a: 1,
      op_b: 2,
      op_c: 3,
    })
  })

  it('Should should not validate when specifying regular expressions and passing invalid property', () => {
    const K = Type.RegEx(/^op_.*$/)
    const T = Type.Record(K, Type.Number())
    fail(T, {
      op_a: 1,
      op_b: 2,
      aop_c: 3,
    })
  })
})

import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Literal', () => {
  // -------------------------------------------------------------------
  // String Literal
  // -------------------------------------------------------------------
  it('Should extend Any (String)', () => {
    type T = 'hello' extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Unknown (String)', () => {
    type T = 'hello' extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String (String)', () => {
    type T = 'hello' extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Boolean (String)', () => {
    type T = 'hello' extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Number (String)', () => {
    type T = 'hello' extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Integer (String)', () => {
    type T = 'hello' extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array (String)', () => {
    type T = 'hello' extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Tuple (String)', () => {
    type T = 'hello' extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 1 (String)', () => {
    type T = 'hello' extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Object({}, { additionalProperties: false }))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 2 (String)', () => {
    type T = 'hello' extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 1 (String)', () => {
    type T = 'hello' extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 2 (String)', () => {
    type T = 'hello' extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 3 (String)', () => {
    type T = 'hello' extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Null (String)', () => {
    type T = 'hello' extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Undefined (String)', () => {
    type T = 'hello' extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  // -------------------------------------------------------------------
  // Number Literal
  // -------------------------------------------------------------------

  it('Should extend Any (Number)', () => {
    type T = 10 extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Unknown (Number)', () => {
    type T = 10 extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String (Number)', () => {
    type T = 10 extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Boolean (Number)', () => {
    type T = 10 extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Number (Number)', () => {
    type T = 10 extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Integer (Number)', () => {
    type T = 10 extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Array (Number)', () => {
    type T = 10 extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Tuple (Number)', () => {
    type T = 10 extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 1 (Number)', () => {
    type T = 10 extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Object({}, { additionalProperties: false }))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 2 (Number)', () => {
    type T = 10 extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 1 (Number)', () => {
    type T = 10 extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 2 (Number)', () => {
    type T = 10 extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 3 (Number)', () => {
    type T = 10 extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Null (Number)', () => {
    type T = 10 extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Undefined (Number)', () => {
    type T = 10 extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  // -------------------------------------------------------------------
  // Boolean Literal
  // -------------------------------------------------------------------

  it('Should extend Any (Boolean)', () => {
    type T = true extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Unknown (Boolean)', () => {
    type T = true extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String (Boolean)', () => {
    type T = true extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Boolean (Boolean)', () => {
    type T = true extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Number (Boolean)', () => {
    type T = true extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Integer (Boolean)', () => {
    type T = true extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array (Boolean)', () => {
    type T = true extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Tuple (Boolean)', () => {
    type T = true extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record 1', () => {
    type T = 'hello' extends Record<number, any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal('hello'), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 2', () => {
    type T = 10 extends Record<number, any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(10), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record 3', () => {
    type T = true extends Record<number, any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 1 (Boolean)', () => {
    type T = true extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Object({}, { additionalProperties: false }))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 2 (Boolean)', () => {
    type T = true extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 1 (Boolean)', () => {
    type T = true extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 2 (Boolean)', () => {
    type T = true extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 3 (Boolean)', () => {
    type T = true extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Null (Boolean)', () => {
    type T = true extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Undefined (Boolean)', () => {
    type T = true extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Void', () => {
    type T = true extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Date', () => {
    type T = true extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Literal(true), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
})

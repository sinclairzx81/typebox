import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Function', () => {
  it('Should extend Constructor 1', () => {
    type T = (() => number) extends new () => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Constructor([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Function 1', () => {
    type T = (() => number) extends () => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Function([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 2', () => {
    type T = (() => any) extends () => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Any()), Type.Function([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 3', () => {
    type T = (() => number) extends () => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Any()), Type.Function([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 4', () => {
    type T = ((a: number) => number) extends () => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([Type.Number()], Type.Number()), Type.Function([], Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Function 5', () => {
    type T = ((a: number | string) => number) extends (a: number) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([Type.Union([Type.Number(), Type.String()])], Type.Number()), Type.Function([Type.Number()], Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 6', () => {
    type T = ((a: number) => number) extends (a: number | string) => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([Type.Number()], Type.Number()), Type.Function([Type.Union([Type.Number(), Type.String()])], Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Function 7', () => {
    type T = ((a: number, b: number) => number) extends (a: number) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([Type.Number(), Type.Number()], Type.Number()), Type.Function([Type.Number()], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Function 8', () => {
    type T = ((a: number) => number) extends (a: number, b: number) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([Type.Number()], Type.Number()), Type.Function([Type.Number(), Type.Number()], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 9', () => {
    type T = (() => number) extends () => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Function([], Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 9', () => {
    type T = (() => any) extends () => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Any()), Type.Function([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 10', () => {
    type T = (() => Array<any>) extends () => object ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Array(Type.Any())), Type.Function([], Type.Object({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 11', () => {
    type T = (() => Array<string>) extends () => object ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Array(Type.String())), Type.Function([], Type.Object({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 12', () => {
    type T = (() => object) extends () => Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Object({})), Type.Function([], Type.Array(Type.Any())))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Function 13', () => {
    type T = ((a: unknown) => number) extends (a: any) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([Type.Unknown()], Type.Number({})), Type.Function([Type.Any()], Type.Number({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 14', () => {
    type T = ((a: any) => number) extends (a: unknown) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([Type.Any()], Type.Number({})), Type.Function([Type.Unknown()], Type.Number({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 15', () => {
    type T = (() => any) extends () => unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Any({})), Type.Function([], Type.Unknown({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Function 16', () => {
    type T = (() => unknown) extends () => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Unknown({})), Type.Function([], Type.Any({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Any', () => {
    type T = (() => number) extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String', () => {
    type T = (() => number) extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Boolean', () => {
    type T = (() => number) extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Number', () => {
    type T = (() => number) extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Integer', () => {
    type T = (() => number) extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 1', () => {
    type T = (() => number) extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 2', () => {
    type T = (() => number) extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 3', () => {
    type T = (() => number) extends Array<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Tuple', () => {
    type T = (() => number) extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record', () => {
    type T = (() => number) extends Record<number, any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 1', () => {
    type T = (() => number) extends object ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 2', () => {
    type T = (() => number) extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 3', () => {
    type T = (() => number) extends { a: number } ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Object({ a: Type.Number() }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 4', () => {
    type T = (() => number) extends { length: '1' } ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Object({ length: Type.Literal('1') }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 5', () => {
    type T = (() => number) extends { length: number } ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Object({ length: Type.Number() }))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 1', () => {
    type T = (() => number) extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Union([Type.Null(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 2', () => {
    type T = (() => number) extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Union([Type.Any(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 3', () => {
    type T = (() => number) extends any | Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Union([Type.Any(), Type.Array(Type.Any())]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 4', () => {
    type T = (() => number) extends any | Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Union([Type.Any(), Type.Array(Type.Any())]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 5', () => {
    type T = (() => number) extends any | Array<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Union([Type.Any(), Type.Array(Type.String())]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Null', () => {
    type T = (() => number) extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Void', () => {
    type T = (() => number) extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Function([], Type.Number()), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Date', () => {
    type T = (() => number) extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
})

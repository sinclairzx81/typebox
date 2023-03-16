import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Constructor', () => {
  it('Should extend Function', () => {
    type T = (new () => number) extends () => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Function([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Constructor 1', () => {
    type T = (new () => number) extends new () => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Constructor([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 2', () => {
    type T = (new () => any) extends new () => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Any()), Type.Constructor([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 3', () => {
    type T = (new () => number) extends new () => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Any()), Type.Constructor([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 4', () => {
    type T = (new (a: number) => number) extends new () => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([Type.Number()], Type.Number()), Type.Constructor([], Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Constructor 5', () => {
    type T = (new (a: number | string) => number) extends new (a: number) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([Type.Union([Type.Number(), Type.String()])], Type.Number()), Type.Constructor([Type.Number()], Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 6', () => {
    type T = (new (a: number) => number) extends new (a: number | string) => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([Type.Number()], Type.Number()), Type.Constructor([Type.Union([Type.Number(), Type.String()])], Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Constructor 7', () => {
    type T = (new (a: number, b: number) => number) extends new (a: number) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([Type.Number(), Type.Number()], Type.Number()), Type.Constructor([Type.Number()], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Constructor 8', () => {
    type T = (new (a: number) => number) extends new (a: number, b: number) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([Type.Number()], Type.Number()), Type.Constructor([Type.Number(), Type.Number()], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 9', () => {
    type T = (new () => number) extends new () => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Constructor([], Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 9', () => {
    type T = (new () => any) extends new () => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Any()), Type.Constructor([], Type.Number()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 10', () => {
    type T = (new () => Array<any>) extends new () => object ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Array(Type.Any())), Type.Constructor([], Type.Object({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Constructor 11', () => {
    type T = (new () => Array<string>) extends new () => object ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Array(Type.String())), Type.Constructor([], Type.Object({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 12', () => {
    type T = (new () => object) extends new () => Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Object({})), Type.Constructor([], Type.Array(Type.Any())))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Constructor 13', () => {
    type T = (new (a: unknown) => number) extends new (a: any) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([Type.Unknown()], Type.Number({})), Type.Constructor([Type.Any()], Type.Number({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 14', () => {
    type T = (new (a: any) => number) extends new (a: unknown) => number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([Type.Any()], Type.Number({})), Type.Constructor([Type.Unknown()], Type.Number({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 15', () => {
    type T = (new () => any) extends new () => unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Any({})), Type.Constructor([], Type.Unknown({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Constructor 16', () => {
    type T = (new () => unknown) extends new () => any ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Unknown({})), Type.Constructor([], Type.Any({})))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Any', () => {
    type T = (new () => number) extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String', () => {
    type T = (new () => number) extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Boolean', () => {
    type T = (new () => number) extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Number', () => {
    type T = (new () => number) extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Integer', () => {
    type T = (new () => number) extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 1', () => {
    type T = (new () => number) extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 2', () => {
    type T = (new () => number) extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 3', () => {
    type T = (new () => number) extends Array<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Tuple', () => {
    type T = (new () => number) extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record', () => {
    type T = (() => number) extends Record<number, any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 1', () => {
    type T = (new () => number) extends object ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 2', () => {
    type T = (new () => number) extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 3', () => {
    type T = (new () => number) extends { a: number } ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Object({ a: Type.Number() }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 4', () => {
    type T = (new () => number) extends { length: '1' } ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Object({ length: Type.Literal('1') }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 1', () => {
    type T = (new () => number) extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Union([Type.Null(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 2', () => {
    type T = (new () => number) extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Union([Type.Any(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 3', () => {
    type T = (new () => number) extends any | Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Union([Type.Any(), Type.Array(Type.Any())]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 4', () => {
    type T = (new () => number) extends any | Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Union([Type.Any(), Type.Array(Type.Any())]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 5', () => {
    type T = (new () => number) extends any | Array<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Union([Type.Any(), Type.Array(Type.String())]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Null', () => {
    type T = (new () => number) extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Undefined', () => {
    type T = (new () => number) extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Void', () => {
    type T = (new () => number) extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Date', () => {
    type T = (new () => number) extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Constructor([], Type.Number()), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
})

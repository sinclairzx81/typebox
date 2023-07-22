import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Iterator', () => {
  // ----------------------------------------------
  // Generic Varying
  // ----------------------------------------------
  it('Should extend Iterator 1', () => {
    type T = IterableIterator<any> extends IterableIterator<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Iterator(Type.Any()), Type.Iterator(Type.Any()))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Iterator 2', () => {
    type T = IterableIterator<string> extends IterableIterator<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Iterator(Type.String()), Type.Iterator(Type.String()))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Iterator 3', () => {
    type T = IterableIterator<'hello'> extends IterableIterator<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Iterator(Type.Literal('hello')), Type.Iterator(Type.String()))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Iterator 4', () => {
    type T = IterableIterator<string> extends IterableIterator<'hello'> ? 1 : 2
    const R = TypeExtends.Extends(Type.Iterator(Type.String()), Type.Iterator(Type.Literal('hello')))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Iterator 5', () => {
    type T = IterableIterator<string> extends IterableIterator<'hello' | number> ? 1 : 2
    const R = TypeExtends.Extends(Type.Iterator(Type.String()), Type.Iterator(Type.Union([Type.Literal('hello'), Type.Number()])))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Iterator 6', () => {
    type T = IterableIterator<'hello' | number> extends IterableIterator<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Iterator(Type.Union([Type.Literal('hello'), Type.Number()])), Type.Iterator(Type.String()))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  // --------------------------------------------------------------------
  // Structural
  // --------------------------------------------------------------------
  it('Should extends Any 1', () => {
    type T = IterableIterator<number> extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Iterator(Type.Number()), Type.Any())
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extends Any 2', () => {
    type T = any extends IterableIterator<number> ? 1 : 2
    const R = TypeExtends.Extends(Type.Any(), Type.Iterator(Type.Number()))
    Assert.isEqual(R, TypeExtendsResult.Union)
  })
  it('Should extends Unknown 1', () => {
    type T = IterableIterator<number> extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Iterator(Type.Number()), Type.Unknown())
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extends Unknown 2', () => {
    type T = unknown extends IterableIterator<number> ? 1 : 2
    const R = TypeExtends.Extends(Type.Unknown(), Type.Iterator(Type.Number()))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extends Never 1', () => {
    type T = IterableIterator<number> extends never ? 1 : 2
    const R = TypeExtends.Extends(Type.Iterator(Type.Number()), Type.Never())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extends Never 2', () => {
    type T = never extends IterableIterator<number> ? 1 : 2
    const R = TypeExtends.Extends(Type.Never(), Type.Iterator(Type.Number()))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
})

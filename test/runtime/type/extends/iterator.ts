import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Iterator', () => {
  // ----------------------------------------------
  // Generic Varying
  // ----------------------------------------------
  it('Should extend Iterator 1', () => {
    type T = IterableIterator<any> extends IterableIterator<any> ? 1 : 2
    const R = ExtendsCheck(Type.Iterator(Type.Any()), Type.Iterator(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Iterator 2', () => {
    type T = IterableIterator<string> extends IterableIterator<string> ? 1 : 2
    const R = ExtendsCheck(Type.Iterator(Type.String()), Type.Iterator(Type.String()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Iterator 3', () => {
    type T = IterableIterator<'hello'> extends IterableIterator<string> ? 1 : 2
    const R = ExtendsCheck(Type.Iterator(Type.Literal('hello')), Type.Iterator(Type.String()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Iterator 4', () => {
    type T = IterableIterator<string> extends IterableIterator<'hello'> ? 1 : 2
    const R = ExtendsCheck(Type.Iterator(Type.String()), Type.Iterator(Type.Literal('hello')))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Iterator 5', () => {
    type T = IterableIterator<string> extends IterableIterator<'hello' | number> ? 1 : 2
    const R = ExtendsCheck(Type.Iterator(Type.String()), Type.Iterator(Type.Union([Type.Literal('hello'), Type.Number()])))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Iterator 6', () => {
    type T = IterableIterator<'hello' | number> extends IterableIterator<string> ? 1 : 2
    const R = ExtendsCheck(Type.Iterator(Type.Union([Type.Literal('hello'), Type.Number()])), Type.Iterator(Type.String()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  // --------------------------------------------------------------------
  // Structural
  // --------------------------------------------------------------------
  it('Should extends Any 1', () => {
    type T = IterableIterator<number> extends any ? 1 : 2
    const R = ExtendsCheck(Type.Iterator(Type.Number()), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extends Any 2', () => {
    type T = any extends IterableIterator<number> ? 1 : 2
    const R = ExtendsCheck(Type.Any(), Type.Iterator(Type.Number()))
    Assert.IsEqual(R, ExtendsResult.Union)
  })
  it('Should extends Unknown 1', () => {
    type T = IterableIterator<number> extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.Iterator(Type.Number()), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extends Unknown 2', () => {
    type T = unknown extends IterableIterator<number> ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Iterator(Type.Number()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extends Never 1', () => {
    type T = IterableIterator<number> extends never ? 1 : 2
    const R = ExtendsCheck(Type.Iterator(Type.Number()), Type.Never())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extends Never 2', () => {
    type T = never extends IterableIterator<number> ? 1 : 2
    const R = ExtendsCheck(Type.Never(), Type.Iterator(Type.Number()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
})

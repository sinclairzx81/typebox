import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/AsyncIterator', () => {
  // ----------------------------------------------
  // Generic Varying
  // ----------------------------------------------
  it('Should extend AsyncIterator 1', () => {
    type T = AsyncIterableIterator<any> extends AsyncIterableIterator<any> ? 1 : 2
    const R = ExtendsCheck(Type.AsyncIterator(Type.Any()), Type.AsyncIterator(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend AsyncIterator 2', () => {
    type T = AsyncIterableIterator<string> extends AsyncIterableIterator<string> ? 1 : 2
    const R = ExtendsCheck(Type.AsyncIterator(Type.String()), Type.AsyncIterator(Type.String()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend AsyncIterator 3', () => {
    type T = AsyncIterableIterator<'hello'> extends AsyncIterableIterator<string> ? 1 : 2
    const R = ExtendsCheck(Type.AsyncIterator(Type.Literal('hello')), Type.AsyncIterator(Type.String()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend AsyncIterator 4', () => {
    type T = AsyncIterableIterator<string> extends AsyncIterableIterator<'hello'> ? 1 : 2
    const R = ExtendsCheck(Type.AsyncIterator(Type.String()), Type.AsyncIterator(Type.Literal('hello')))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend AsyncIterator 5', () => {
    type T = AsyncIterableIterator<string> extends AsyncIterableIterator<'hello' | number> ? 1 : 2
    const R = ExtendsCheck(Type.AsyncIterator(Type.String()), Type.AsyncIterator(Type.Union([Type.Literal('hello'), Type.Number()])))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend AsyncIterator 6', () => {
    type T = AsyncIterableIterator<'hello' | number> extends AsyncIterableIterator<string> ? 1 : 2
    const R = ExtendsCheck(Type.AsyncIterator(Type.Union([Type.Literal('hello'), Type.Number()])), Type.AsyncIterator(Type.String()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  // --------------------------------------------------------------------
  // Structural
  // --------------------------------------------------------------------
  it('Should extends Any 1', () => {
    type T = AsyncIterableIterator<number> extends any ? 1 : 2
    const R = ExtendsCheck(Type.AsyncIterator(Type.Number()), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extends Any 2', () => {
    type T = any extends AsyncIterableIterator<number> ? 1 : 2
    const R = ExtendsCheck(Type.Any(), Type.AsyncIterator(Type.Number()))
    Assert.IsEqual(R, ExtendsResult.Union)
  })
  it('Should extends Unknown 1', () => {
    type T = AsyncIterableIterator<number> extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.AsyncIterator(Type.Number()), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extends Unknown 2', () => {
    type T = unknown extends AsyncIterableIterator<number> ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.AsyncIterator(Type.Number()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extends Never 1', () => {
    type T = AsyncIterableIterator<number> extends never ? 1 : 2
    const R = ExtendsCheck(Type.AsyncIterator(Type.Number()), Type.Never())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extends Never 2', () => {
    type T = never extends AsyncIterableIterator<number> ? 1 : 2
    const R = ExtendsCheck(Type.Never(), Type.AsyncIterator(Type.Number()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
})

import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/AsyncIterator', () => {
  it('Should pass async iterator 1', () => {
    async function* f() {}
    const T = Type.AsyncIterator(Type.Any())
    const result = Value.Check(T, f())
    Assert.IsEqual(result, true)
  })
  it('Should pass async iterator 2', () => {
    const T = Type.AsyncIterator(Type.Any())
    const result = Value.Check(T, {
      [Symbol.asyncIterator]: () => {},
    })
    Assert.IsEqual(result, true)
  })
  it('Should pass async iterator', () => {
    const T = Type.AsyncIterator(Type.Any())
    const result = Value.Check(T, {})
    Assert.IsEqual(result, false)
  })
})

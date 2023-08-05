import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler/AsyncIterator', () => {
  it('Should validate a async iterator 1', () => {
    async function* f() {}
    const T = Type.AsyncIterator(Type.Any())
    Ok(T, f())
  })
  it('Should validate a async iterator 2', () => {
    const T = Type.AsyncIterator(Type.Any())
    Ok(T, {
      [Symbol.asyncIterator]: () => {},
    })
  })
  it('Should not validate a async iterator', () => {
    const T = Type.AsyncIterator(Type.Any())
    Fail(T, {})
  })
})

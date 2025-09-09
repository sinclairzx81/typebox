import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.AsyncIterator')

Test('Should validate a async iterator 1', () => {
  async function* f() {}
  const T = Type.AsyncIterator(Type.Any())
  Ok(T, f())
})
Test('Should validate a async iterator 2', () => {
  const T = Type.AsyncIterator(Type.Any())
  Ok(T, {
    [Symbol.asyncIterator]: () => {}
  })
})
Test('Should not validate a async iterator', () => {
  const T = Type.AsyncIterator(Type.Any())
  Fail(T, {})
})

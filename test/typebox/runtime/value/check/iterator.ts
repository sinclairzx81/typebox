import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Iterator')

Test('Should validate a iterator 1', () => {
  function* f() {}
  const T = Type.Iterator(Type.Any())
  Ok(T, f())
})
Test('Should validate a iterator 2', () => {
  const T = Type.Iterator(Type.Any())
  Ok(T, {
    [Symbol.iterator]: () => {}
  })
})
Test('Should not validate a iterator', () => {
  const T = Type.Iterator(Type.Any())
  Fail(T, {})
})

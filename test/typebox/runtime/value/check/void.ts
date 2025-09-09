import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Void')

Test('Should not validate number', () => {
  const T = Type.Void()
  Fail(T, 1)
})
Test('Should not validate string', () => {
  const T = Type.Void()
  Fail(T, 'hello')
})
Test('Should not validate boolean', () => {
  const T = Type.Void()
  Fail(T, true)
})
Test('Should not validate array', () => {
  const T = Type.Void()
  Fail(T, [1, 2, 3])
})
Test('Should not validate object', () => {
  const T = Type.Void()
  Fail(T, { a: 1, b: 2 })
})
Test('Should validate null', () => {
  const T = Type.Void()
  Fail(T, null)
})
Test('Should validate undefined', () => {
  const T = Type.Void()
  Ok(T, undefined)
})
Test('Should validate void 0', () => {
  const T = Type.Void()
  Ok(T, void 0)
})

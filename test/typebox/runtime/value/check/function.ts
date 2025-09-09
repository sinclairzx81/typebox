import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Function')

Test('Should validate function 1', () => {
  const T = Type.Function([Type.Number()], Type.Number())
  Ok(T, function () {})
})
Test('Should validate function 2', () => {
  const T = Type.Function([Type.Number()], Type.Number())
  // note: validation only checks typeof 'function'
  Ok(T, function (a: string, b: string, c: string, d: string) {})
})
Test('Should validate function 3', () => {
  const T = Type.Function([Type.Number()], Type.Number())
  // note: validation only checks typeof 'function'
  Ok(T, function () {
    return 'not-a-number'
  })
})
Test('Should not validate function', () => {
  const T = Type.Function([Type.Number()], Type.Number())
  Fail(T, 1)
})

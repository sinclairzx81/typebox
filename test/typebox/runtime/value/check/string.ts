import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.String')

Test('Should not validate number', () => {
  const T = Type.String()
  Fail(T, 1)
})
Test('Should validate string', () => {
  const T = Type.String()
  Ok(T, 'hello')
})
Test('Should not validate boolean', () => {
  const T = Type.String()
  Fail(T, true)
})
Test('Should not validate array', () => {
  const T = Type.String()
  Fail(T, [1, 2, 3])
})
Test('Should not validate object', () => {
  const T = Type.String()
  Fail(T, { a: 1, b: 2 })
})
Test('Should not validate null', () => {
  const T = Type.String()
  Fail(T, null)
})
Test('Should not validate undefined', () => {
  const T = Type.String()
  Fail(T, undefined)
})
Test('Should not validate bigint', () => {
  const T = Type.String()
  Fail(T, BigInt(1))
})
Test('Should not validate symbol', () => {
  const T = Type.String()
  Fail(T, Symbol(1))
})
Test('Should validate string format as email', () => {
  const T = Type.String({ format: 'email' })
  Ok(T, 'name@domain.com')
})
Test('Should validate string format as uuid', () => {
  const T = Type.String({ format: 'uuid' })
  Ok(T, '4a7a17c9-2492-4a53-8e13-06ea2d3f3bbf')
})
Test('Should validate string format as iso8601 date', () => {
  const T = Type.String({ format: 'date-time' })
  Ok(T, '2021-06-11T20:30:00-04:00')
})
Test('Should validate minLength', () => {
  const T = Type.String({ minLength: 4 })
  Ok(T, '....')
  Fail(T, '...')
})
Test('Should validate maxLength', () => {
  const T = Type.String({ maxLength: 4 })
  Ok(T, '....')
  Fail(T, '.....')
})
Test('Should pass numeric 5 digit test', () => {
  const T = Type.String({ pattern: '[\\d]{5}' })
  Ok(T, '12345')
})
Test('Should should escape characters in the pattern', () => {
  const T = Type.String({ pattern: '/a/' })
  Ok(T, '/a/')
})
Test('Should validate regular expression 1', () => {
  const T = Type.String({ pattern: /foo/i })
  Ok(T, 'foo')
  Ok(T, 'Foo')
  Ok(T, 'fOO')
  Fail(T, 'bar')
})
Test('Should validate regular expression 2', () => {
  const T = Type.String({ pattern: /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu })
  Ok(T, '♥️♦️♠️♣️')
})
Test('Should validate with minLength constraint', () => {
  const T = Type.String({ pattern: /(.*)/, minLength: 3 })
  Ok(T, 'xxx')
  Fail(T, 'xx')
})
Test('Should validate with maxLength constraint', () => {
  const T = Type.String({ pattern: /(.*)/, maxLength: 3 })
  Ok(T, 'xxx')
  Fail(T, 'xxxx')
})
Test('Should validate regular expression 1', () => {
  const T = Type.String({ pattern: /[012345]/.source })
  Ok(T, '0')
  Ok(T, '1')
  Ok(T, '2')
  Ok(T, '3')
  Ok(T, '4')
  Ok(T, '5')
})
Test('Should validate regular expression 2', () => {
  const T = Type.String({ pattern: /true|false/.source })
  Ok(T, 'true')
  Ok(T, 'true')
  Ok(T, 'true')
  Ok(T, 'false')
  Ok(T, 'false')
  Ok(T, 'false')
  Fail(T, '6')
})
Test('Should validate regular expression 3', () => {
  const T = Type.String({ pattern: /true|false/.source })
  Fail(T, 'unknown')
})
Test('Should validate regular expression 4', () => {
  const T = Type.String({ pattern: /[\d]{5}/.source })
  Ok(T, '12345')
})
//-----------------------------------------------------
// Regular Pattern
//-----------------------------------------------------
Test('Should validate pattern 1', () => {
  const T = Type.String({ pattern: '[012345]' })
  Ok(T, '0')
  Ok(T, '1')
  Ok(T, '2')
  Ok(T, '3')
  Ok(T, '4')
  Ok(T, '5')
})
Test('Should validate pattern 2', () => {
  const T = Type.String({ pattern: 'true|false' })
  Ok(T, 'true')
  Ok(T, 'false')
  Fail(T, '6')
})
Test('Should validate pattern 3', () => {
  const T = Type.String({ pattern: 'true|false' })
  Fail(T, 'unknown')
})
Test('Should validate pattern 4', () => {
  const T = Type.String({ pattern: '[\\d]{5}' })
  Ok(T, '12345')
})

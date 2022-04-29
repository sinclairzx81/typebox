import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/RegEx', () => {
  it('Should validate numeric value', () => {
    const T = Type.RegEx(/[012345]/)
    ok(T, '0')
    ok(T, '1')
    ok(T, '2')
    ok(T, '3')
    ok(T, '4')
    ok(T, '5')
  })

  it('Should validate true or false string value', () => {
    const T = Type.RegEx(/true|false/)
    ok(T, 'true')
    ok(T, 'true')
    ok(T, 'true')
    ok(T, 'false')
    ok(T, 'false')
    ok(T, 'false')
    fail(T, '6')
  })

  it('Should not validate failed regex test', () => {
    const T = Type.RegEx(/true|false/)
    fail(T, 'unknown')
  })

  it('Should pass numeric 5 digit test', () => {
    const T = Type.RegEx(/[\d]{5}/)
    ok(T, '12345')
  })
})

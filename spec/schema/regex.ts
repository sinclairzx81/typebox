import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('RegEx', () => {

  it('Numeric',  () => {
    const T = Type.RegEx(/[012345]/)
    ok(T, '0')
    ok(T, '1')
    ok(T, '2')
    ok(T, '3')
    ok(T, '4')
    ok(T, '5')
    fail(T, '6')
  })
})

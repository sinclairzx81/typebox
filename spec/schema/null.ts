import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Null", () => {
  it('Null',  () => {
    const T = Type.Null()
    ok(T, null)
    fail(T, {})
    fail(T, [])
    fail(T, 1)
    fail(T, true)
    fail(T, 'hello')
  })
})

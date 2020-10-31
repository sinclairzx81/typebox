import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Boolean", () => {
  it('Boolean',  () => {
    const T = Type.Boolean()
    ok(T, true)
    fail(T, {})
    fail(T, [])
    fail(T, 42)
    fail(T, 'hello')
    fail(T, null)
  })
})

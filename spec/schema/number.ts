import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Number", () => {
  it('Number',  () => {
    const T = Type.Number()
    ok(T, 42)
    fail(T, {})
    fail(T, [])
    fail(T, 'hello')
    fail(T, true)
    fail(T, null)
  })
})

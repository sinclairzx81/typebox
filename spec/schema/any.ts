import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Any", () => {
  it('Any', () => {
    const T = Type.Any()
    ok(T, null)
    ok(T, {})
    ok(T, [])
    ok(T, 1)
    ok(T, true)
    ok(T, 'hello')
  })
})

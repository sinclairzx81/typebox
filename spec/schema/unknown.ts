import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Unknown", () => {
  it('Unknown', () => {
    const T = Type.Unknown()
    ok(T, null)
    ok(T, {})
    ok(T, [])
    ok(T, 1)
    ok(T, true)
    ok(T, 'hello')
  })
})

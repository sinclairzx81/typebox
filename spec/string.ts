import { Type } from '../src/typebox'
import { ok, fail } from './validate'

describe("String", () => {
  it('String',  () => {
    const T = Type.String()
    ok(T, 'hello')
    fail(T, {})
    fail(T, [])
    fail(T, 1)
    fail(T, true)
    fail(T, null)
  })
})

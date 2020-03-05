import { Type } from '../src/typebox'
import { ok, fail } from './validate'

describe("Range", () => {
  it('Range',  () => {
    const T = Type.Range(10, 20)
    ok(T, 10)
    ok(T, 20)
    fail(T, 9)
    fail(T, 21)
  })
})
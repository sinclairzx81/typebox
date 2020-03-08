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

  it('DateTime', () => {
    const T = Type.String({ format: 'date-time' })
    ok(T, "2018-11-13T20:20:39+00:00")
    fail(T, "2018-11-13")
    fail(T, "20:20:39+00:00")
    fail(T, "string")
  })

  it('Email', () => {
      const T = Type.String({ format: 'email' })
      ok(T, "dave@domain.com")
      fail(T, "orange")
  })
})

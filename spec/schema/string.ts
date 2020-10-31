import { Type } from '@sinclair/typebox'
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

  it('Uuid', () => {
    const T = Type.String({ format: 'uuid' })
    ok(T, 'f1b35107-5a79-4108-8ff8-470087865b9c')
    ok(T, '67e147cf-c47b-472d-9cbe-b85177d791b6')
    ok(T, 'db8cd64f-b297-4ef1-a0ba-298322965247')
    ok(T, '30957e77-40c4-4b05-8d4d-64f63b83034d')
    ok(T, 'abe8f990-370e-479a-b452-851ae15714dc')
    ok(T, '4f08d994-cafe-4075-a9ca-bedc8a49427b')
    fail(T, 'orange')
  })
})

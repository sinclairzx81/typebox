import { Type } from '../src/typebox'
import { ok, fail } from './validate'

describe('Guid', () => {
  it('Guid', () => {
    const T = Type.Guid()
    ok(T, 'f1b35107-5a79-4108-8ff8-470087865b9c')
    ok(T, '67e147cf-c47b-472d-9cbe-b85177d791b6')
    ok(T, 'db8cd64f-b297-4ef1-a0ba-298322965247')
    ok(T, '30957e77-40c4-4b05-8d4d-64f63b83034d')
    ok(T, 'abe8f990-370e-479a-b452-851ae15714dc')
    ok(T, '4f08d994-cafe-4075-a9ca-bedc8a49427b')
    fail(T, 'orange')
  })
})
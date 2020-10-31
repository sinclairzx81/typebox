import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Tuple', () => {

  it('[A, B]', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Tuple([A, B])

    ok(T, [{ a: 'hello' }, { b: 42 }])
    fail(T, [{ b: 42 }, { a: 'hello' }])
  })

  it('[A, B, C]', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const C = Type.Object({ c: Type.Boolean() })
    const T = Type.Tuple([A, B, C])

    ok(T, [{ a: 'hello' }, { b: 42 }, { c: true }])
    fail(T, [{ c: true }, { a: 'hello' }, { b: 42 }])
  })
})

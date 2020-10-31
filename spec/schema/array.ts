import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Array", () => {
  it('Array <any>',  () => {
    const T = Type.Array(Type.Any())
    ok(T, [])
    ok(T, [0, true, 'hello', {}])
  })

  it('Array <A>',  () => {
    const A = Type.Number()
    const T = Type.Array(A)
    ok(T,   [])
    ok(T,   [1, 2, 3, 4])
    fail(T, [true])
    fail(T, [null])
  })

  it('Array <A | B>',  () => {
    const A = Type.Number()
    const B = Type.String()
    const T = Type.Array(Type.Union([A, B]))
    ok(T,   [])
    ok(T,   [1, 'hello', 3, 'world'])
    fail(T, [1, 'hello', 3, 'world', null])
    fail(T, [null])
  })

  it('Array <A & B>',  () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.String() })
    const T = Type.Array(Type.Intersect([A, B]))
    ok(T,   [])
    ok(T,   [{a: 'hello', b: 'world'}])
    fail(T, [{a: 'hello'}])
    fail(T, [{b: 'world'}])
    fail(T, [null])
  })

  it('Array <[A, B]>',  () => {
    const A = Type.String()
    const B = Type.Number()
    const T = Type.Array(Type.Tuple([A, B]))
    ok(T,   [])
    ok(T,   [['hello', 42]])
    fail(T, [[42, 'hello']])
    fail(T, [null])
  })
})

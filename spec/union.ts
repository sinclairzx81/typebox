import { Type } from '../src/typebox'
import { ok, fail } from './validate'

describe('Union', () => {

  it('number | string', () => {
    const A = Type.String()
    const B = Type.Number()
    const T = Type.Union([A, B])
    
    fail(T, { })
    ok(T, 'hello')
    ok(T, 42)
  })

  it('A | B', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Union([A, B])
    
    fail(T, {a: 'hello', b: 42 })
    ok(T, { a: 'hello' })
    ok(T, { b: 42 })
  })

  it('A | B | C', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const C = Type.Object({ c: Type.Boolean() })
    const T = Type.Union([A, B, C])
    
    fail(T, {a: 'hello', b: 42, c: true })
    ok(T, {a: 'hello' })
    ok(T, {b: 42 })
    ok(T, {c: true })
  })
})

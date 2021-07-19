import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Dict', () => {

  it('Dict <string, any>',  () => {
    const T = Type.Record(Type.Any())

    ok(T, { key: 32 })
    ok(T, { key: 'hello' })
    ok(T, { key: true })
    ok(T, { key: {} })
    ok(T, { key: [] })
    ok(T, { key: null })
  })

  it('Dict <string, A>',  () => {
    const A = Type.String()
    const T = Type.Record(A)
  
    ok(T, { key: 'hello' })
    fail(T, { key: 32 })
    fail(T, { key: true })
    fail(T, { key: {} })
    fail(T, { key: [] })
    fail(T, { key: null })
  })

  it('Dict <A | B>',  () => {
    const A = Type.Number()
    const B = Type.String()
    const T = Type.Record(Type.Union([A, B]))

    ok(T, { key: 'hello' })
    ok(T, { key: 32 })
    fail(T, { key: true })
    fail(T, { key: {} })
    fail(T, { key: [] })
    fail(T, { key: null })
  })

  it('Dict <A & B>',  () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.String() })
    const T = Type.Record(Type.Intersect([A, B]))

    ok(T, { key: {a: 'hello', b: 'world'} })
    fail(T, { key: {b: 'world'} })
    fail(T, { key: {a: 'hello'} })
    fail(T, { key: true })
    fail(T, { key: {} })
    fail(T, { key: [] })
    fail(T, { key: null })
  })

  it('Dict <[A, B]>',  () => {
    const A = Type.String()
    const B = Type.Number()
    const T = Type.Record(Type.Tuple([A, B]))

    ok(T, { key: ['hello', 42] })
    fail(T, { key: [42, 'hello'] })
    fail(T, { key: {a: 'hello'} })
    fail(T, { key: {} })
    fail(T, { key: [] })
    fail(T, { key: [null] })
  })
})

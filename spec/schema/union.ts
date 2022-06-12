import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/schema/Union', () => {
  it('Should validate union of string, number and boolean', () => {
    const A = Type.String()
    const B = Type.Number()
    const C = Type.Boolean()
    const T = Type.Union([A, B, C])
    ok(T, 'hello')
    ok(T, true)
    ok(T, 42)
  })

  it('Should validate union of objects', () => {
    const A = Type.Object({ a: Type.String() }, { additionalProperties: false })
    const B = Type.Object({ b: Type.String() }, { additionalProperties: false })
    const T = Type.Union([A, B])
    ok(T, { a: 'hello' })
    ok(T, { b: 'world' })
  })

  it('Should fail to validate for descriminated union types', () => {
    const A = Type.Object({ kind: Type.Literal('A'), value: Type.String() })
    const B = Type.Object({ kind: Type.Literal('B'), value: Type.Number() })
    const T = Type.Union([A, B])
    fail(T, { kind: 'A', value: 42 }) // expect { kind: 'A', value: string }
    fail(T, { kind: 'B', value: 'hello' }) // expect { kind: 'B', value: number }
  })

  it('Should validate union of objects where properties overlap', () => {
    const A = Type.Object({ a: Type.String() }, { additionalProperties: false })
    const B = Type.Object({ a: Type.String(), b: Type.String() }, { additionalProperties: false })
    const T = Type.Union([A, B])
    ok(T, { a: 'hello' }) // A
    ok(T, { a: 'hello', b: 'world' }) // B
  })

  it('Should validate union of overlapping property of varying type', () => {
    const A = Type.Object({ a: Type.String(), b: Type.Number() }, { additionalProperties: false })
    const B = Type.Object({ a: Type.String(), b: Type.String() }, { additionalProperties: false })
    const T = Type.Union([A, B])
    ok(T, { a: 'hello', b: 42 }) // A
    ok(T, { a: 'hello', b: 'world' }) // B
  })

  it('Should validate union of literal strings', () => {
    const A = Type.Literal('hello')
    const B = Type.Literal('world')
    const T = Type.Union([A, B])
    ok(T, 'hello') // A
    ok(T, 'world') // B
  })

  it('Should not validate union of literal strings for unknown string', () => {
    const A = Type.Literal('hello')
    const B = Type.Literal('world')
    const T = Type.Union([A, B])
    fail(T, 'foo') // A
    fail(T, 'bar') // B
  })
})

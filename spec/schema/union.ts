import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Union', () => {

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

    it('Should validate union of objects where properties overlap', () => {
        const A = Type.Object({ a: Type.String() }, { additionalProperties: false })
        const B = Type.Object({ a: Type.String(), b: Type.String() }, { additionalProperties: false })
        const T = Type.Union([A, B])
        ok(T, { a: 'hello' })             // A
        ok(T, { a: 'hello', b: 'world' }) // B
    })
   

    it('Should validate union of overlapping property of varying type', () => {
        const A = Type.Object({ a: Type.String(), b: Type.Number() }, { additionalProperties: false })
        const B = Type.Object({ a: Type.String(), b: Type.String() }, { additionalProperties: false })
        const T = Type.Union([A, B])
        ok(T, { a: 'hello', b: 42 })      // A
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


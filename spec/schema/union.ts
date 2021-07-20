import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Union', () => {

    it('number | string', () => {
        const A = Type.String()
        const B = Type.Number()
        const T = Type.Union([A, B])

        fail(T, {})
        ok(T, 'hello')
        ok(T, 42)
    })

    it('A | (A & B)', () => {
        const A = Type.Object({ a: Type.String() })
        const B = Type.Object({ a: Type.String(), b: Type.Optional(Type.Number()) })
        const T = Type.Union([A, B])

        fail(T, {})
        ok(T, { a: 'hello', b: 42 })
        ok(T, { a: 'hello' })
    })

    it('A | B | C', () => {
        const A = Type.Object({ a: Type.String() })
        const B = Type.Object({ b: Type.Number() })
        const C = Type.Object({ c: Type.Boolean() })
        const T = Type.Union([A, B, C])

        fail(T, {})
        ok(T, { a: 'hello' })
        ok(T, { b: 42 })
        ok(T, { c: true })
    })

    it('A | B (tagged union)', () => {
        const T = Type.Union([
            Type.Object({
                kind: Type.Literal('string'),
                value: Type.String()
            }),
            Type.Object({
                kind: Type.Literal('number'),
                value: Type.Number()
            })
        ])

        ok(T, { kind: 'string', value: 'hello' })
        ok(T, { kind: 'number', value: 1 })

        fail(T, { kind: 'string', value: 1 })
        fail(T, { kind: 'number', value: 'hello' })
    })
})


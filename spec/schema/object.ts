import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Object', () => {

    it('Should not validate a number', () => {
        const T = Type.Object({})
        fail(T, 42)
    })

    it('Should validate Date', () => {
        const T = Type.Object({})
        ok(T, new Date())
    })

    it('Should not validate a string', () => {
        const T = Type.Object({})
        fail(T, 'hello')
    })

    it('Should not validate a boolean', () => {
        const T = Type.Object({})
        fail(T, true)
    })
    
    it('Should not validate a null', () => {
        const T = Type.Object({})
        fail(T, null)
    })

    it('Should not validate an array', () => {
        const T = Type.Object({})
        fail(T, [1, 2])
    })

    it('Should validate with correct property values', () => {
        const T = Type.Object({
            a: Type.Number(),
            b: Type.String(),
            c: Type.Boolean(),
            d: Type.Array(Type.Number()),
            e: Type.Object({ x: Type.Number(), y: Type.Number() })
        })
        ok(T, {
            a: 10,
            b: 'hello',
            c: true,
            d: [1, 2, 3],
            e: { x: 10, y: 20 }
        })
    })

    it('Should not validate with incorrect property values', () => {
        const T = Type.Object({
            a: Type.Number(),
            b: Type.String(),
            c: Type.Boolean(),
            d: Type.Array(Type.Number()),
            e: Type.Object({ x: Type.Number(), y: Type.Number() })
        })
        fail(T, {
            a: 'not a number', // error
            b: 'hello',
            c: true,
            d: [1, 2, 3],
            e: { x: 10, y: 20 }
        })
    })

    it('Should allow additionalProperties by default', () => {
        const T = Type.Object({
            a: Type.Number(),
            b: Type.String()
        })
        ok(T, {
            a: 1,
            b: 'hello',
            c: true
        })
    })

    it('Should not allow additionalProperties if additionalProperties is false', () => {
        const T = Type.Object({
            a: Type.Number(),
            b: Type.String()
        }, { additionalProperties: false })
        fail(T, {
            a: 1,
            b: 'hello',
            c: true
        })
    })

    it('Should not allow properties for an empty object when additionalProperties is false', () => {
        const T = Type.Object({}, { additionalProperties: false })
        ok(T, {})
        fail(T, { a: 10 })
    })
})

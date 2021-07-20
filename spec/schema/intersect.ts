import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Intersect', () => {

    it('Should intersect two objects', () => {
        const A = Type.Object({ a: Type.String() })
        const B = Type.Object({ b: Type.Number() })
        const T = Type.Intersect([A, B])
        ok(T, { a: 'hello', b: 42 })
    })

    it('Should allow additional properties if not using unevaluatedProperties', () => {
        const A = Type.Object({ a: Type.String() })
        const B = Type.Object({ b: Type.Number() })
        const T = Type.Intersect([A, B])
        ok(T, { a: 'hello', b: 42, c: true })
    })

    it('Should not allow additional properties if using unevaluatedProperties', () => {
        const A = Type.Object({ a: Type.String() })
        const B = Type.Object({ b: Type.Number() })
        const T = Type.Intersect([A, B], { unevaluatedProperties: false })
        fail(T, { a: 'hello', b: 42, c: true })
    })

    describe('Should not allow unevaluatedProperties with record intersection', () => {
        const A = Type.Object({
            a: Type.String(),
            b: Type.String(),
            c: Type.String()
        })
        const B = Type.Record(Type.Number(), Type.Number())
        const T = Type.Intersect([A, B])
        ok(T, {
            a: 'a', b: 'b', c: 'c',
            0: 1, 1: 2, 2: 3
        })
    })

    describe('Should intersect object with number record', () => {
        const A = Type.Object({
            a: Type.String(),
            b: Type.String(),
            c: Type.String()
        })
        const B = Type.Record(Type.Number(), Type.Number())
        const T = Type.Intersect([A, B])
        ok(T, {
            a: 'a', b: 'b', c: 'c',
            0: 1, 1: 2, 2: 3
        })
    })

    describe('Should not intersect object with string record', () => {
        const A = Type.Object({
            a: Type.String(),
            b: Type.String(),
            c: Type.String()
        })
        const B = Type.Record(Type.String(), Type.Number())
        const T = Type.Intersect([A, B])
        fail(T, {
            a: 'a', b: 'b', c: 'c',
            x: 1, y: 2, z: 3
        })
    })

    describe('Should intersect object with union literal record', () => {
        const A = Type.Object({
            a: Type.String(),
            b: Type.String(),
            c: Type.String()
        })
        const K = Type.Union([
            Type.Literal('x'),
            Type.Literal('y'),
            Type.Literal('z')
        ])
        const B = Type.Record(K, Type.Number())
        const T = Type.Intersect([A, B])
        ok(T, {
            a: 'a', b: 'b', c: 'c',
            x: 1, y: 2, z: 3
        })
    })
})

import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Tuple', () => {

    it('Should validate tuple of [string, number]', () => {
        const A = Type.String()
        const B = Type.Number()
        const T = Type.Tuple([A, B])
        ok(T, ['hello', 42])
    })

    it('Should not validate tuple of [string, number] when reversed', () => {
        const A = Type.String()
        const B = Type.Number()
        const T = Type.Tuple([A, B])
        fail(T, [42, 'hello'])
    })

    it('Should validate tuple of objects', () => {
        const A = Type.Object({ a: Type.String() })
        const B = Type.Object({ b: Type.Number() })
        const T = Type.Tuple([A, B])
        ok(T, [
            { a: 'hello' },
            { b: 42 },
        ])
    })

    it('Should not validate tuple of objects when reversed', () => {
        const A = Type.Object({ a: Type.String() })
        const B = Type.Object({ b: Type.Number() })
        const T = Type.Tuple([A, B])
        fail(T, [
            { b: 42 },
            { a: 'hello' },
        ])
    })
})

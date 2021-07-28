import { Type } from '@sinclair/typebox'
import { isRegExp } from 'util'
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

    it('Should validate empty tuple []', () => {
        const T = Type.Tuple([])
        ok(T, [])
    })
    
    it('Should not validate empty tuple [] with one or more elements', () => {
        const T = Type.Tuple([])
        fail(T, [1])
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

    it('Should not validate tuple when array is less than tuple length', () => {
        const A = Type.Object({ a: Type.String() })
        const B = Type.Object({ b: Type.Number() })
        const T = Type.Tuple([A, B])
        fail(T, [
            { a: 'hello' },
        ])
    })

    it('Should not validate tuple when array is greater than tuple length', () => {
        const A = Type.Object({ a: Type.String() })
        const B = Type.Object({ b: Type.Number() })
        const T = Type.Tuple([A, B])
        fail(T, [
            { a: 'hello' },
            { b: 42 },
            { b: 42 },
        ])
    })
})

import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Ref', () => {

    it('Should should validate when referencing a type', () => {
        const T = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { $id: 'T' })
        const R = Type.Ref(T)
        ok(R, { 
            x: 1, 
            y: 2, 
            z: 3 
        }, [T])
    })

    it('Should not validate when passing invalid data', () => {
        const T = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { $id: 'T' })
        const R = Type.Ref(T)
        fail(R, { 
            x: 1, 
            y: 2
        }, [T])
    })

    it('Should should not validate when not specifying an $id', () => {
        const T = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { })
        const R = Type.Ref(T)
        fail(R, { 
            x: 1, 
            y: 2, 
            z: 3 
        }, [T])
    })

    it('Should not validate when not adding additional schema', () => {
        const T = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { $id: 'T' })
        const R = Type.Ref(T)
        fail(R, { 
            x: 1, 
            y: 2, 
            z: 3 
        }, [])
    })
})
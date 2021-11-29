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

    it('Should throw when not specifying an $id on target schema', () => {
        try {
            const T = Type.Object({
                x: Type.Number(),
                y: Type.Number(),
                z: Type.Number()
            }, { })
            const R = Type.Ref(T)
        } catch {
            return
        }
        throw Error('Expected throw')
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

    it('Should validate as a Box, and as a Ref', () => {
        const Vertex = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { $id: 'Vertex' })
        
        const Box = Type.Namespace({ 
            Vertex 
        }, { $id: 'Box' })
        
        const R1 = Type.Ref(Vertex)
        
        const R2 = Type.Ref(Box, 'Vertex')

        ok(R1, { 
            x: 1, 
            y: 2, 
            z: 3 
        }, [Box])
        ok(R2, { 
            x: 1, 
            y: 2, 
            z: 3 
        }, [Box])
    })
})
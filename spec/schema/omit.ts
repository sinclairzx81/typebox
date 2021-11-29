import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { strictEqual } from 'assert'

describe('Omit', () => {
    it('Should omit properties on the source schema', () => {
        const A = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { additionalProperties: false })
        const T = Type.Omit(A, ['z'])
        ok(T, { x: 1, y: 1 })
    })

    it('Should remove required properties on the target schema', () => {
        const A = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { additionalProperties: false })
        const T = Type.Omit(A, ['z'])
        strictEqual(T.required!.includes('z'), false)
    })

    it('Should inherit options from the source object', () => {
        const A = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { additionalProperties: false })
        const T = Type.Omit(A, ['z'])
        strictEqual(A.additionalProperties, false)
        strictEqual(T.additionalProperties, false)
    })
    
    it('Should construct new object when targetting reference', () => {
        const T = Type.Object({ a: Type.String(), b: Type.String() }, { $id: 'T' })
        const R = Type.Ref(T)
        const P = Type.Omit(R, [])
        strictEqual(P.properties.a.type, 'string')
        strictEqual(P.properties.b.type, 'string')
     })
})

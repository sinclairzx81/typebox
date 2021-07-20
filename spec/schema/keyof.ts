import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("KeyOf", () => {
    it('Should validate with all object keys as a kind of union', () => {
        const T = Type.KeyOf(Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number(),
        }))
        ok(T, 'x')
        ok(T, 'y')
        ok(T, 'z')
        fail(T, 'w')
    })

    it('Should validate ', () => {
        const T = Type.Object({
            k: Type.KeyOf(Type.Object({
                x: Type.Number(),
                y: Type.Number(),
                z: Type.Number(),
            }))
        })
        ok(T, { k: 'x' })
        ok(T, { k: 'y' })
        ok(T, { k: 'z' })
        fail(T, { k: 'w' })
    })
})

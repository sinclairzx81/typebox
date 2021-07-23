import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Required', () => {

    it('Should validate after applying strict', () => {
        const A = Type.Object({
            x: Type.Optional(Type.Number()),
            y: Type.Optional(Type.Number()),
            z: Type.Optional(Type.Number())
        }, { additionalProperties: false })
        const T = Type.Strict(Type.Required(A))
        ok(T, { x: 1, y: 1, z: 1 })
        fail(T, { x: 1, y: 1 })
        fail(T, { x: 1 })
        fail(T, {})
    })

    it('Should validate if applying $schema.', () => {
        const A = Type.Object({
            x: Type.Optional(Type.Number()),
            y: Type.Optional(Type.Number()),
            z: Type.Optional(Type.Number())
        }, { additionalProperties: false })
        const $schema = 'https://json-schema.org/draft/2019-09/schema'
        const T = Type.Strict(Type.Required(A), { $schema })
        ok(T, { x: 1, y: 1, z: 1 })
        fail(T, { x: 1, y: 1 })
        fail(T, { x: 1 })
        fail(T, {})
    })
    
})

import { Type, ReadonlyModifier, ReadonlyOptionalModifier, OptionalModifier } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { strictEqual } from 'assert'

describe('Required', () => {

    it('Should convert a partial object into a required object', () => {
        const A = Type.Object({
            x: Type.Optional(Type.Number()),
            y: Type.Optional(Type.Number()),
            z: Type.Optional(Type.Number())
        }, { additionalProperties: false })
        const T = Type.Required(A)
        ok(T, { x: 1, y: 1, z: 1 })
        fail(T, { x: 1, y: 1 })
        fail(T, { x: 1 })
        fail(T, {})
    })

    it('Should update modifier types correctly when converting to required', () => {
        const A = Type.Object({
            x: Type.ReadonlyOptional(Type.Number()),
            y: Type.Readonly(Type.Number()),
            z: Type.Optional(Type.Number()),
            w: Type.Number()
        })
        const T = Type.Required(A)
        strictEqual(T.properties.x.modifier, ReadonlyModifier)
        strictEqual(T.properties.y.modifier, ReadonlyModifier)
        strictEqual(T.properties.z.modifier, undefined)
        strictEqual(T.properties.w.modifier, undefined)
    })

    it('Should inherit options from the source object', () => {
        const A = Type.Object({
            x: Type.Optional(Type.Number()),
            y: Type.Optional(Type.Number()),
            z: Type.Optional(Type.Number())
        }, { additionalPropeties: false })
        const T = Type.Required(A)
        strictEqual(A.additionalPropeties, false)
        strictEqual(T.additionalPropeties, false)
    })

    it('Should construct new object when targetting reference', () => {
        const T = Type.Object({ a: Type.String(), b: Type.String() }, { $id: 'T' })
        const R = Type.Ref(T)
        const P = Type.Required(R)
        strictEqual(P.properties.a.type, 'string')
        strictEqual(P.properties.b.type, 'string')
     })
})

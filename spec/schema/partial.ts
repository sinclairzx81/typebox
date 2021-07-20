import { OptionalModifier, ReadonlyOptionalModifier, Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { strictEqual } from 'assert'

describe('Partial', () => {

    it('Should convert a required object into a partial.', () => {
        const A = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { additionalProperties: false })
        const T = Type.Partial(A)
        ok(T, { x: 1, y: 1, z: 1 })
        ok(T, { x: 1, y: 1 })
        ok(T, { x: 1 })
        ok(T, {})
    })

    it('Should update modifier types correctly when converting to partial', () => {
        const A = Type.Object({
            x: Type.ReadonlyOptional(Type.Number()),
            y: Type.Readonly(Type.Number()),
            z: Type.Optional(Type.Number()),
            w: Type.Number()
        }, { additionalProperties: false })
        const T = Type.Partial(A)
        strictEqual(T.properties.x.modifier, ReadonlyOptionalModifier)
        strictEqual(T.properties.y.modifier, ReadonlyOptionalModifier)
        strictEqual(T.properties.z.modifier, OptionalModifier)
        strictEqual(T.properties.w.modifier, OptionalModifier)
    })

    it('Should inherit options from the source object', () => {
        const A = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { additionalProperties: false })
        const T = Type.Partial(A)
        strictEqual(A.additionalProperties, false)
        strictEqual(T.additionalProperties, false)
    })
})

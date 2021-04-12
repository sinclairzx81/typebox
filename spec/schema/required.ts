import { Type, ReadonlyModifier, ReadonlyOptionalModifier, OptionalModifier } from '@sinclair/typebox'
import { ok, fail }    from './validate'
import { strictEqual } from 'assert'

describe('Required', () => {

    it('Partial to Required', () => {
        const Partial = Type.Object({ 
            x: Type.Optional(Type.Number()),
            y: Type.Optional(Type.Number()),
            z: Type.Optional(Type.Number())
        })
        const Required = Type.Required(Partial)
        ok(Partial,    { })
        ok(Required,   { x: 1, y: 1, z: 1 })
        fail(Required, { })
    })

    it('Modifiers', () => {
        const T = Type.Object({ 
            x: Type.ReadonlyOptional(Type.Number()),
            y: Type.Readonly(Type.Number()),
            z: Type.Optional(Type.Number()),
            w: Type.Number()
        })
        const U = Type.Required(T)
        strictEqual(U.properties.x.modifier, ReadonlyModifier)
        strictEqual(U.properties.y.modifier, ReadonlyModifier)
        strictEqual(U.properties.z.modifier, undefined)
        strictEqual(U.properties.w.modifier, undefined)
    })

    it('Options', () => {
        const Partial = Type.Object({
            x: Type.Optional(Type.Number()),
            y: Type.Optional(Type.Number()),
            z: Type.Optional(Type.Number())
        }, { title: 'Partial' })
        const Required = Type.Required(Partial, { title: 'Required' })
        strictEqual(Partial.title, 'Partial')
        strictEqual(Required.title, 'Required')
    })
})

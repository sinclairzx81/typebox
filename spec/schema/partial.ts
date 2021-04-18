import { OptionalModifier, ReadonlyOptionalModifier, Type }        from '@sinclair/typebox'
import { ok, fail }    from './validate'
import { strictEqual } from 'assert'

describe('Partial', () => {
    
    it('Required to Partial', () => {
        const Required = Type.Object({ 
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        })
        const Partial = Type.Partial(Required)
        ok(Required, { x: 1, y: 1, z: 1 })
        ok(Partial, {})
        ok(Partial, { x: 1, y: 1, z: 1 })
        ok(Partial, { x: 1, y: 1 })
        ok(Partial, { x: 1 })
    })

    it('Modifiers', () => {
        const T = Type.Object({ 
            x: Type.ReadonlyOptional(Type.Number()),
            y: Type.Readonly(Type.Number()),
            z: Type.Optional(Type.Number()),
            w: Type.Number()
        })
        const U = Type.Partial(T)
        strictEqual(U.properties.x.modifier, ReadonlyOptionalModifier)
        strictEqual(U.properties.y.modifier, ReadonlyOptionalModifier)
        strictEqual(U.properties.z.modifier, OptionalModifier)
        strictEqual(U.properties.w.modifier, OptionalModifier)
    })

    it('Options', () => {
        const Required = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { title: 'Required' })
        const Partial = Type.Partial(Required, { title: 'Partial' })
        strictEqual(Required.title, 'Required')
        strictEqual(Partial.title, 'Partial')
    })
})

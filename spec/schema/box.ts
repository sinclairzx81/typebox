import { Type } from '@sinclair/typebox'
import { validator } from './validate'


describe("Box", () => {
    it('Should should validate Vertex structure', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Box('math3d', { Vector2, Vector3, Vector4 })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal: Type.Ref(Math3D, 'Vector3'),
            uv: Type.Ref(Math3D, 'Vector2'),
        })

        const ajv = validator().addSchema(Math3D)
        const ok = ajv.validate(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal: { x: 1, y: 1, z: 1 },
            uv: { x: 1, y: 1 },
        })
        if (ok === false) throw Error('Expected success')
    })
    it('Should not validate when Vertex structure is missing properties', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Box('math3d', { Vector2, Vector3, Vector4 })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal: Type.Ref(Math3D, 'Vector3'),
            uv: Type.Ref(Math3D, 'Vector2'),
        })
        const ajv = validator().addSchema(Math3D)
        const ok = ajv.validate(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal: { x: 1, y: 1, z: 1 },
        })
        if (ok === true) throw Error('Expected fail')
    })

    it('Should not validate when Vertex structure contains invalid property values.', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Box('math3d', { Vector2, Vector3, Vector4 })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal:  Type.Ref(Math3D, 'Vector3'),
            uv:      Type.Ref(Math3D, 'Vector2'),
        })
        const ajv = validator().addSchema(Math3D)
        const ok = ajv.validate(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal: { x: 1, y: 1, z: 1 },
            uv: { x: 1, y: 'not a number'},
        })
        if (ok === true) throw Error('Expected fail')
    })
    it('Should not validate when Box has not been registered with validator (AJV)', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Box('math3d', { Vector2, Vector3, Vector4 })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal:   Type.Ref(Math3D, 'Vector3'),
            uv:       Type.Ref(Math3D, 'Vector2'),
        })
        const ajv = validator()
        let did_throw = false
        try {
            ajv.validate(Vertex, {
                position: { x: 1, y: 1, z: 1, w: 1 },
                normal:   { x: 1, y: 1, z: 1 },
                uv:       { x: 1, y: 1},
            })
        } catch {
            did_throw = true
        }

        if (did_throw === false) throw Error('Expected throw')
    })
})

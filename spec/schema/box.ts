import { Type } from '@sinclair/typebox'
import { createValidator } from './validate'


describe("Box", () => {
    it('Should validate with correct data', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Box('math3d', { Vector2, Vector3, Vector4 })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal: Type.Ref(Math3D, 'Vector3'),
            uv: Type.Ref(Math3D, 'Vector2'),
        })

        const validator = createValidator().addSchema(Math3D)
        const ok = validator.validate(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal: { x: 1, y: 1, z: 1 },
            uv: { x: 1, y: 1 },
        })



        if (ok === false) throw Error('Expected success')

    })
    it('Should fail with missing property', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Box('math3d', { Vector2, Vector3, Vector4 })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal: Type.Ref(Math3D, 'Vector3'),
            uv: Type.Ref(Math3D, 'Vector2'),
        })
        const validator = createValidator().addSchema(Math3D)
        const ok = validator.validate(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal: { x: 1, y: 1, z: 1 },
        })
        if (ok === true) throw Error('Expected fail')
    })
    it('Should fail with invalid data', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Box('math3d', { Vector2, Vector3, Vector4 })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal: Type.Ref(Math3D, 'Vector3'),
            uv: Type.Ref(Math3D, 'Vector2'),
        })
        const validator = createValidator().addSchema(Math3D)
        const ok = validator.validate(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal: { x: 1, y: 1, z: 1 },
            uv: { x: 1, y: 'not a number'},
        })
        if (ok === true) throw Error('Expected fail')
    })
    it('Should throw for non-registered box', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Box('math3d', { Vector2, Vector3, Vector4 })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal: Type.Ref(Math3D, 'Vector3'),
            uv: Type.Ref(Math3D, 'Vector2'),
        })
        const validator = createValidator()
        let did_throw = false
        try {
            validator.validate(Vertex, {
                position: { x: 1, y: 1, z: 1, w: 1 },
                normal: { x: 1, y: 1, z: 1 },
                uv: { x: 1, y: 1},
            })
        } catch {
            did_throw = true
        }

        if (did_throw === false) throw Error('Expected throw')
    })
})

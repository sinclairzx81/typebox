import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Box", () => {

    it('Should should validate Vertex structure', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Namespace({ Vector2, Vector3, Vector4 }, { $id: 'Math3D' })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal: Type.Ref(Math3D, 'Vector3'),
            uv: Type.Ref(Math3D, 'Vector2'),
        })

        ok(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal:   { x: 1, y: 1, z: 1 },
            uv:       { x: 1, y: 1 },
        }, [Math3D])
    })

    it('Should not validate when Vertex structure is missing properties', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Namespace({ Vector2, Vector3, Vector4 }, { $id: 'Math3D' })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal: Type.Ref(Math3D, 'Vector3'),
            uv: Type.Ref(Math3D, 'Vector2'),
        })

        fail(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal:   { x: 1, y: 1, z: 1 },
        }, [Math3D])
    })

    it('Should not validate when Vertex structure contains invalid property values.', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Namespace({ Vector2, Vector3, Vector4 }, { $id: 'Math3D' })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal:  Type.Ref(Math3D, 'Vector3'),
            uv:      Type.Ref(Math3D, 'Vector2'),
        })
        fail(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal:   { x: 1, y: 1, z: 1 },
            uv:       { x: 1, y: 'not a number'},
        }, [Math3D])
    })

    it('Should not validate when Box has not been registered with validator (AJV)', () => {
        const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
        const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
        const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
        const Math3D = Type.Namespace({ Vector2, Vector3, Vector4 }, { $id: 'Math3D' })
        const Vertex = Type.Object({
            position: Type.Ref(Math3D, 'Vector4'),
            normal:   Type.Ref(Math3D, 'Vector3'),
            uv:       Type.Ref(Math3D, 'Vector2'),
        })
        fail(Vertex, {
            position: { x: 1, y: 1, z: 1, w: 1 },
            normal:   { x: 1, y: 1, z: 1 },
            uv:       { x: 1, y: 1},
        }, [])
    })
})

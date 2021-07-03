import { Type, Static, TObject, TProperties } from '@sinclair/typebox'
import { ok } from '../spec/schema/validate'
// -----------------------------------------------
// npm start to run example
// -----------------------------------------------

const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })

const Box = Type.Box({ vector2: Vector2, Vector3, Vector4 })

const Vertex = Type.Object({
    position: Type.Ref(Box, 'Vector4'),
    normal:   Type.Ref(Box, 'Vector3'),
    uv:       Type.Ref(Box, 'vector2'),
    time:     Type.Number()
})

console.log(Vertex)

const S = Type.Omit(Vertex, ['position'])

console.log(S)

ok(Vertex, {
    position: { x: 1, y: 1, z: 1, w: 1},
    normal: { x: 1, y: 1, z: 1},
    uv: { x: 1, y: 1, z: 1},
    time: 1
})
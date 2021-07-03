import { Type, Static } from '@sinclair/typebox'

// -----------------------------------------------
// npm start to run example
// -----------------------------------------------


const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
const Math3D  = Type.Box('math3d', { Vector2, Vector3, Vector4 })

const Vertex = Type.Object({
    position:  Type.Ref(Math3D, 'Vector4'),
    normal:    Type.Ref(Math3D, 'Vector3'),
    uv:        Type.Ref(Math3D, 'Vector2'),
})


type Vertex = Static<typeof Vertex>

function test(v: Vertex) {
    // ..
}

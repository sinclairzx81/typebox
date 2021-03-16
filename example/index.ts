import { Type, Static } from '@sinclair/typebox'

const Vector3 = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
})

const Vector2 = Type.Pick(Vector3, ['x', 'y']) 

function test(v: Static<typeof Vector2>) {
    
}

test({ x: 10, y: 10 })


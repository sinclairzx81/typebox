import { Type, Static } from '@sinclair/typebox'

const Vertex = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
}, { $id: 'Vertex' })

const Box = Type.Box({ Vertex }, { $id: 'Box' })

const R1 = Type.Ref(Vertex)

const R2 = Type.Ref(Box, 'Vertex')

console.log(R1)

console.log(R2)









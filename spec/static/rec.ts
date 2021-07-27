import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T1 = Type.Rec(Self => Type.Object({
    id: Type.String(),
    nodes: Type.Array(Self)
}))

const F1 = (arg: Static<typeof T1>) => { }
F1({
    id: '1',
    nodes: [
        { id: '2', nodes: [] }, 
        { id: '3', nodes: [] }
    ]
})


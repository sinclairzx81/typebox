import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Rec(Self => Type.Number())
const F0 = (arg: Static<typeof T0>) => {}
F0(1)

const T1 = Type.Rec(Self => Type.Object({
    id: Type.String(),
    nodes: Type.Array(Self)
}))
const F1 = (arg: Static<typeof T1>) => {}
F1({
    id: '1',
    nodes: [{
        id: '2', 
        nodes: [] as Static<typeof T1>[]
    }] as Static<typeof T1>[]
})


import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T1 = Type.Object({
    x: Type.Number(),
    y: Type.Number()
}, { $id: 'T1' })

const R1 = Type.Ref(T1)

const F1 = (arg: Static<typeof R1>) => { }
F1({
    x: 1,
    y: 1
})

// --------------------------------------------

const T2 = Type.Box({
    Vector: Type.Object({
        x: Type.Number(),
        y: Type.Number()
    }, { $id: 'T1' })
})

const R2 = Type.Ref(T2, 'Vector')

const F2 = (arg: Static<typeof R2>) => { }
F2({
    x: 1,
    y: 1
})

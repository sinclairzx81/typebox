import { Type, Static } from '@sinclair/typebox'

// -------------------------------------------------

const T0 = Type.Union([
    Type.String()
])
const F0 = (arg: Static<typeof T0>) => { }
F0('')

// -------------------------------------------------

const T1 = Type.Union([
    Type.String(),
    Type.Number()
])

const F1 = (arg: Static<typeof T1>) => { }
F1('')
F1(100)

// -------------------------------------------------

const T2 = Type.Union([
    Type.Union([
        Type.String(),
        Type.Number()
    ]),
    Type.Union([
        Type.Boolean(),
        Type.Null()
    ])
])
const F2 = (arg: Static<typeof T2>) => { }
F2('string')
F2(100)
F2(true)
F2(null)

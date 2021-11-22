import { Type, Static, TSchema } from '@sinclair/typebox';

const T = Type.KeyOf(Type.Object({
    A: Type.String(),
    B: Type.String(),
    C: Type.Readonly(Type.String())
}))

const I = Type.Intersect([Type.String(), Type.Number()], {
    
})

// const T = Type.Union([Type.Number(), Type.String()])

// const A = Type.Object({ a: Type.String() })
// const B = Type.Object({ b: Type.String() })
// const C = Type.Object({ c: Type.String() })
// const T = Type.Intersect([A, Type.Union([B, C])])

type A = Static<typeof T>





import { Type, Static, TSchema } from '@sinclair/typebox';
const T = Type.Intersect([
    Type.Object({
        password: Type.String(),
    }),
    Type.Union([
        Type.Object({
            username: Type.String()
        }),
        Type.Object({
            email: Type.String()
        }),
    ])
])

type T = Static<typeof T>


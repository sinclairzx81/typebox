import { Type, Static, TSchema } from '@sinclair/typebox';

const T = Type.KeyOf(Type.Object({
    A: Type.String(),
    B: Type.String(),
    C: Type.Readonly(Type.String())
}))

const K = Type.Union([Type.Literal('O'), Type.Literal('P')])

const R = Type.Record(T, Type.Number())

type T = Static<typeof R>








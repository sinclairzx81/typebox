import { Type, Static } from '@sinclair/typebox'

// --------------------------------------------

const T0 = Type.Constructor([], Type.Object({
    a: Type.Integer()
}))
const F0 = (arg: Static<typeof T0>) => {}
class C0 {
    a = 5
}
F0(C0)

const T1 = Type.Constructor([
    Type.String(),
    Type.Integer()
], Type.Object({
    name: Type.String()
}))
const F1 = (arg: Static<typeof T1>) => {}
class C1 {
    name: string = ''
    constructor(arg1: string, arg2: number) {}
}
F1(C1)

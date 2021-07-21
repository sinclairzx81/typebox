import { Type, Static } from '@sinclair/typebox'

enum A {
    A = 1,
    B = "h"
}

const T = Type.Enum(A)

console.log(T)

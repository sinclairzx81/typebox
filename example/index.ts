import { Type, Static } from '@sinclair/typebox'

enum A {
    A,
    B,
}

const T = Type.Enum(A)

console.log(JSON.stringify(T, null, 2))

type T = Static<typeof T>

function test(value: T) {

}

test(A.B)




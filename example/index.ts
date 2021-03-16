import { Type, Static } from '@sinclair/typebox'

const T = Type.Partial(
    Type.Object({
        x: Type.Number(),
        y: Type.Number()
    })
)

console.log(T)

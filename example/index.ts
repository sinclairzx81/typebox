import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type } from '@sinclair/typebox'

const A = Type.Object({
    x: Type.Number()
})

const B = Type.Object({
    y: Type.Number()
})

const I = Type.Intersect([A, B])

console.log(I)






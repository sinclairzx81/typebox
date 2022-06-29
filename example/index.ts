import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
})

const C = TypeCompiler.Compile(T)







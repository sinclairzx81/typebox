import { TypeCompiler } from 'src/compiler/compiler'
import { Type, Kind } from '@sinclair/typebox'

const Z = Type.Object({
    a: Type.Number(),
    b: Type.Number()
})

const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number(),
    a: Type.Array(Type.Number())
})

const C = TypeCompiler.Compile(T)

console.log([...C.Errors({
    x: 'hello', a: [1, 2, 3, '']
})])







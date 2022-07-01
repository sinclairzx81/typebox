import { TypeCompiler } from 'src/compiler/compiler'
import { Type, Kind } from '@sinclair/typebox'

const V = Type.Object({
    a: Type.Number({ minimum: 1, maximum: 100 }),
    b: Type.Number({ minimum: 1, maximum: 100 }),
    c: Type.Number({ minimum: 1, maximum: 100 }),
}, { $id: 'V' })

const R = Type.Ref(V)

const T = Type.Object({
    a: Type.Number({ minimum: 1, maximum: 100 }),
    b: Type.Number({ minimum: 1, maximum: 100 }),
    c: Type.Number({ minimum: 1, maximum: 100 }),
    r: R,
    node: Type.Recursive(Node => Type.Object({
        rs: Type.Array(Node)
    }), { $id: 'Node'})
})

const C = TypeCompiler.Compile(T, [V])

console.log(C.Code())







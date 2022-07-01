import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type } from '@sinclair/typebox'

const T = Type.Object({
    x: Type.Number({ }),
    y: Type.Number({ }),
    z: Type.Number({ }),
})

const C = TypeCompiler.Compile(T)

const V = {
    x: 1,
    y: 1,
    z: '1'
}

if (!C.Check(V)) {
    for (const error of C.Errors(V)) {
        console.log(error.path, error.message, error.schema)
    }
}









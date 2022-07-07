import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

const T = Type.Array(Type.Number(), { uniqueItems: true, minItems: 50 })

const V = [0, 1, 2, 2]

const C = TypeCompiler.Compile(T)
console.log(C.Code())
console.log(C.Check([1, 1]))

for(const error of Value.Errors(T, V)) {
  console.log(error)
}
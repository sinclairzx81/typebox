import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type } from '@sinclair/typebox'

const C = TypeCompiler.Compile(Type.String())

console.log(C.Code())










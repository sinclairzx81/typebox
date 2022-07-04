import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const T = Type.Array(Type.Object({ x: Type.Number() }))
const value = [{ x: 1 }, { x: 1 }, { x: 1 }]
const result = Value.Check(T, value)
console.log(result)



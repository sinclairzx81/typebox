import { Codegen } from '@sinclair/typebox/codegen'

import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Conditional } from '@sinclair/typebox/conditional'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema, TUnion } from '@sinclair/typebox'

TypeSystem.AllowNaN = true

const T = Type.Object({
  x: Type.Union([Type.Number(), Type.Undefined()]),
})

const E = [...Value.Errors(T, {})]

const C = TypeCompiler.Compile(T)

console.log(C.Code())

console.log(C.Check({ x: undefined }))

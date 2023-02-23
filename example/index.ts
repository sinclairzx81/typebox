import { Codegen } from '@sinclair/typebox/codegen'

import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Conditional } from '@sinclair/typebox/conditional'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema, TUnion } from '@sinclair/typebox'

const T = Type.Object({
  x: Type.Undefined(),
})

const E = [...Value.Errors(T, {})]

console.log(E)

console.log(Value.Check(T, { x: undefined }))

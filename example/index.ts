import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema } from '@sinclair/typebox'

console.log(Value.Hash(1))
console.log(Value.Hash(2))

const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

type T = Static<typeof T>


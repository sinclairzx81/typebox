import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'


const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

type T = Static<typeof T>

console.log(T)
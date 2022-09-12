import { TypeBoxCodegen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
  1: Type.Number(),
  y: Type.Number(),
  3: Type.Number()
})

const K = Type.KeyOf(T)

type K = Static<typeof K>

console.log(K)

type T = Static<typeof T>

console.log(T)
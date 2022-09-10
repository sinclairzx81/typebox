import { TypeBoxCodegen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const T = Type.Array(Type.Number({ default: 77 }), {
  minItems: 1,
  maxItems: 1
})

TypeGuard.Assert(T)


// // const C = Value.Cast(T, 1)
// const C = Value.Cast(T, [0, 1])

// console.log(C)

// type T = Static<typeof T>

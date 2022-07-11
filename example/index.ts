import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const A = Conditional.Exclude(Type.Union([
  Type.Literal('a'),
  Type.Literal('b'),
  Type.Literal('c'),
]), Type.Union([
  Type.Literal('c'),
])
)
console.log(A)

type T = Static<typeof A>


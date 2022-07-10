import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'


const T = Conditional.Extends(
  Type.Number(), 
  Type.Number(), 
  Type.Literal('true'), 
  Type.Literal('false')
)

type T = Static<typeof T>


console.log(T)




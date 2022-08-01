import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Value } from '@sinclair/typebox/value'

import { Type, Static } from '@sinclair/typebox'

console.log(TypeGuard.TNumber(Type.Number({ exclusiveMaximum: 1 })))

const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

type T = Static<typeof T>

console.log(T)
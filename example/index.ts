import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/extends'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'


const T = Conditional.Extends(
  Type.Array(Type.Any()),
  Type.Number(),
  Type.Literal(true),
  Type.Literal(false)
)

// const T = Type.Object({
//   x: Type.String(),
//   y: Type.String(),
//   z: Type.String()
// }, { $id: 'T' })


console.log(T)
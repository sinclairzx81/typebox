import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/extends'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'


// const T = Conditional.Extends(
//   Type.Array(Type.String()),
//   Type.Array(Type.String()),
//   Type.Literal(true),
//   Type.Literal(false)
// )

const T = Conditional.Exclude(
  Type.Union([
    Type.Literal('a'),
    Type.Literal('b'),
    Type.Literal('c'),
  ]),
  Type.Union([
    Type.Literal('a'),
  ])
)

type T = Static<typeof T>
const A = Type.Array(Type.Any())

type A = Static<typeof A>
// const T = Type.Object({
//   x: Type.String(),
//   y: Type.String(),
//   z: Type.String()
// }, { $id: 'T' })


console.log(T)
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { Value } from '@sinclair/typebox/value'
import { Type, Static, TObject, TOmit, TUnion, TTuple, TLiteral, ObjectOptions, TPick, ObjectPropertyKeys, UnionToTuple } from '@sinclair/typebox'


const S = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number(),
  a: Type.Number(),
  b: Type.Number(),
  c: Type.Number()
})

const A = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})



const T = Type.Omit(S, Type.KeyOf(A))

console.log(T)

type T = Static<typeof T>

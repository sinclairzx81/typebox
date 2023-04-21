import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

type S = { 0: number }
type M = S['0']

const S = Type.Object({
  0: Type.Number(),
})

type T = Static<typeof T>
const T = Type.Index(S, Type.Literal('0'))
console.log(T)

import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

const T = Type.Recursive(Self => Type.Object({
  a: Type.String(),
  b: Type.String(),
  c: Type.String(),
  d: Type.Array(Self)
}))

const K = Type.KeyOf(T)
console.log(K)
type T = Static<typeof K>



import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

const A = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
})
const B = Type.Object({
  a: Type.Number({ default: Value.Create(Type.Number()) }),
  b: Type.Number({ default: Value.Create(Type.Number()) }),
})
const T = Type.Intersect([A, B], { default: Value.Create(B) })
const R = Value.Clone(process.env)

console.log(R)

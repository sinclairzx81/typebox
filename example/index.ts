import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const T1 = Type.Object({
  a: Type.Number({ default: 1 }),
  b: Type.Number({ default: 2 }),
  c: Type.Recursive(Node => Type.Object({
    id: Type.String({ default: 'unknown' }),
    no: Type.Array(Node)
  }))
}, { $id: 'T1' })

const T2 = Type.Object({
  a: Type.Number({ default: 1 }),
  b: Type.Number({ default: 2 }),
  c: Type.Recursive(Node => Type.Object({
    id: Type.String({ default: 'unknown' }),
  }))
}, { $id: 'T2' })

const V2 = Type.Object({
  x: Type.Number(),
  y: Type.Number()
})

const V3 = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Ref(T1)
})
const V4 = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Ref(T2)
})
const A = Value.Create(V2)
A.x = 123


const B = Value.Cast(V3, [T1], A)
const C = Value.Cast(V4, [T2], B)

console.log(A)
console.log(B)
console.log(C)



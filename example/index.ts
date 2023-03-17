import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Static } from './typedef'

const A = Type.Struct('A', {
  x: Type.Optional(Type.Float32()),
  y: Type.Float32(),
  z: Type.Float32(),
})
const B = Type.Struct('B', {
  x: Type.Optional(Type.Float32()),
  y: Type.Float32(),
  z: Type.Float32(),
})
const C = Type.Struct('C', {
  x: Type.String(),
  y: Type.String(),
})

const U = Type.Union('type', [A, B, C])
console.log(JSON.stringify(U, null, 2))
console.log(Value.Check(U, { type: 'C', x: '', y: '1' }))

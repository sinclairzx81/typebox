import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

const T = Type.Object({
  x: Type.String(),
  y: Type.String(),
  z: Type.String()
}, { $id: 'T' })

console.log(T)
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const T = Value.Cast(Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Boolean({ default: true })
}), {x: '123', y: true, z: 0 })

console.log(T)
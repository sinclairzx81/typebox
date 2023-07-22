import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

const T = Type.Intersect([Type.String(), Type.Number()])

const R = Type.RegExp('hello world')

const M = Type.Object({
  x: Type.Number(),
  y: Type.String(),
  z: Type.Boolean(),
})

import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

const T = Type.Object({
  0: Type.Number(),
  1: Type.String()
})

const A = Type.Index(T, Type.Literal(1))


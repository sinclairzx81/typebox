import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema } from '@sinclair/typebox'
import { ok } from '../test/runtime/schema/validate'

const T = Type.Object({
  x: Type.Number(),
  y: Type.Number()
})

const A = Type.Array(T, { uniqueItems: true })

const R = Value.Check(A, [
  { x: 1, y: 2, z: 3 },
  { x: 1, y: 2, z: 3 },
  { x: 1, y: 2, z: 3 },
])

console.log(R)

ok(A, [
  { x: 1, y: 2, z: 3 },
  { x: 2, y: 2, z: 3 },
  { x: 3, y: 2, z: 3 }
])



import { TypeBoxCodegen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Optional(Type.Number())
})

const A = Value.Create(T)
const B = Value.Create(T)
B.x = 123
B.z = 2

const edits = Value.Diff(A, B)

console.log(edits)

const patch = Value.Patch(B, edits)
console.log(patch)



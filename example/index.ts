import { Codegen } from '@sinclair/typebox/codegen'
import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Conditional } from '@sinclair/typebox/conditional'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema } from '@sinclair/typebox'

// -----------------------------------------------------------
// Create: Type
// -----------------------------------------------------------

const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number(),
})

type T = Static<typeof T>

console.log(T)

// -----------------------------------------------------------
// Create: Value
// -----------------------------------------------------------

const V = Value.Create(T)

console.log(V)

// -----------------------------------------------------------
// Compile: Type
// -----------------------------------------------------------

const C = TypeCompiler.Compile(T)

console.log(C.Code())

// -----------------------------------------------------------
// Check: Value
// -----------------------------------------------------------

console.log(C.Check(V))

import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'
import { Syntax } from '@sinclair/typebox/syntax'

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
// Parse: Type
// -----------------------------------------------------------

const S = Syntax({ T }, `{ x: T, y: T, z: T }`)

type S = Static<typeof S>

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

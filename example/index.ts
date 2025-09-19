import Type, { type Static } from 'typebox'
import { Compile } from 'typebox/compile'
import Format from 'typebox/format'
import Value from 'typebox/value'

// Test('Should use exactOptionalPropertyTypes FALSE 2', () => {
//   const T = Type.Object({ x: Type.Optional(Type.Number()) })
//   Ok(T, { x: 1 })
//   Ok(T, { x: undefined })
//   Ok(T, {})
// })

const T = Type.Object({ x: Type.Optional(Type.Number()) })

const X = { x: undefined }

const A = Value.Check(T, X)
const B = Compile(T).Check(X)
const C = Value.Errors(T, X)

console.log({ A, B, C })
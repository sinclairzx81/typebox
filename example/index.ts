import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { Value, ValueErrorType } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
  x: Type.String({ minLength: 100 }),
  y: Type.Number(),
  z: Type.Number()
})
const S = Type.String()
const U = Type.Union([T, S])
const E = [...Value.Errors(U, {x: 'a'})]

E.map(error => {
  switch(error.type) {
    case ValueErrorType.Array: return ''
  }
})
console.log(E)


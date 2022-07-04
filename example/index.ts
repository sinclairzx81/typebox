import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
}, { additionalProperties: false })


const E = Value.Errors(T, [])

for(const value of E) {
  console.log(value)
}




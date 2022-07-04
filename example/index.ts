import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

for(const error of Value.Errors(T, {})) {
  console.log(error)
}



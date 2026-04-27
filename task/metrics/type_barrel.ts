import * as Type from 'typebox'

const T = Type.Object({
  x: Type.Number(),
  y: Type.String(),
  z: Type.Boolean()
})

console.log(T)
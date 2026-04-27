import * as Schema from 'typebox/schema'
import * as Type from 'typebox'

const T = Type.Object({
  x: Type.Number(),
  y: Type.String(),
  z: Type.Boolean(),
  w: Type.Array(Type.Null()),
  a: Type.Union([ 
    Type.Symbol(), 
    Type.Undefined() 
  ])
})
const C = Schema.Compile(T)
const A = C.Parse({ x: 1, y: '', z: false })
console.log(A)
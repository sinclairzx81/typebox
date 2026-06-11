import * as Type from 'typebox'

// const { F } = Type.Script(`
//    type F = ({ x: number } & { x: 1 }) extends { x: 1 } ? 1 : 2
// `)
//  type F = ({ x: number } & { x: 1 }) extends { x: 1 } ? 1 : 2

const X = Type.Script(`{
  x: number
  y: number
  z: number  
}`)

const A = Type.Keys({ X, Y: Type.Ref('X') }, Type.Ref('Y'))

console.log(A)

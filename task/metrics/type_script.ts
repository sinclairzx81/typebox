import * as Type from 'typebox'

const T = Type.Script(`{
  x: number
  y: string
  z: boolean
}`)

console.log(T)
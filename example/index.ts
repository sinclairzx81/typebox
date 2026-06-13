import * as Type from 'typebox'

import { Memory  } from 'typebox/system'

// ConvertToIntegerKey  (what are we doing with this?)
// - We should probably localize to KeyValue:Object

// const { F } = Type.Script(`
//    type F = ({ x: number } & { x: 1 }) extends { x: 1 } ? 1 : 2
// `)
//  type F = ({ x: number } & { x: 1 }) extends { x: 1 } ? 1 : 2

// const { A, B } = Type.Script(`
//   export interface A { self: this, items: this[] }
//   export type B = number[]['length']
// `)

const A = Type.Array(Type.String())
const B = Type.Index(A, Type.Literal('length'))

console.log(B)

// const K = Type.Record(Type.TemplateLiteral('x-${string}'), Type.Null())
// const T: Type.TTemplateLiteral<'^x-.*$'> = Type.KeyOf(K)



// "^x-.*$"

// ConvertToIntegerKey(left)



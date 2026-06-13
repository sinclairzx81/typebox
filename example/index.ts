import * as Type from 'typebox'

import { Memory  } from 'typebox/system'

// ConvertToIntegerKey  (what are we doing with this?)
// - We should probably localize to KeyValue:Object

// const { F } = Type.Script(`
//    type F = ({ x: number } & { x: 1 }) extends { x: 1 } ? 1 : 2
// `)
//  type F = ({ x: number } & { x: 1 }) extends { x: 1 } ? 1 : 2

const X = Type.Object({
  0: Type.Number(),
  x: Type.String()
})

const K = Type.Index(X, Type.Literal('x'))

console.log(K)

// const K = Type.Record(Type.TemplateLiteral('x-${string}'), Type.Null())
// const T: Type.TTemplateLiteral<'^x-.*$'> = Type.KeyOf(K)



// "^x-.*$"

// ConvertToIntegerKey(left)



import { Type, Static } from '@sinclair/typebox'

const A = Type.Record(['a', 'b'], Type.String())

const B = Type.Object({ c: Type.Number() })

const C = Type.Intersect([A, B])

console.log(C)

type Z = Static<typeof C>

function test(value: Z) {
   value.a = ''
   value.x = 'hello'
}


import { Type, Static } from '@sinclair/typebox'
import { ok } from '../spec/schema/validate'

const X = Type.Object({
    type: Type.String()
})

console.log(Type.Strict(X))
const Vector = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
})

const Properties = Type.Union([
    Type.Literal('a'),
    Type.Literal('b'),
    Type.Literal('c'),
])

const T0 = Type.Record(Properties, Type.Number())

type T0 = Static<typeof T0>

const T = Type.Intersect([T0, Vector], { unevaluatedProperties: false })

type T = Static<typeof T>
console.log(JSON.stringify(T, null, 2))
ok(T, {
    a: 1,
    b: 1,
    c: 1,
    x: 1,
    y: 1,
    z: 1,
    // f: 1,
})


function test(value: T) {
    
}
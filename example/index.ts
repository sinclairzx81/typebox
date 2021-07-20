import { Type, Static } from '@sinclair/typebox'
import { ok } from '../spec/schema/validate'

const Vector = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
})

// const Base = Type.Object({
//     a: Type.Number(),
//     b: Type.Number(),
//     c: Type.Number()
// })

const T0 = Type.Record(Type.Number(), Type.Number())

type T0 = Static<typeof T0>

const T = Type.Intersect([T0, Vector], { unevaluatedProperties: false })

type T = Static<typeof T>
console.log(JSON.stringify(T, null, 2))
ok(T, {
    a: 2,
    b: 2,
    c: 2,
    x: 1,
    y: 1,
    z: 1,
    // f: 'hello'
})


function test(value: T) {
    
}
import { Type, Static } from '@sinclair/typebox'
import { ok } from '../spec/schema/validate'

const Vector = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
})

const Base = Type.Object({
    a: Type.Number(),
    b: Type.Number(),
    c: Type.Number()
})

const T0 = Type.Record(Type.Union([
    Type.Literal('a'),
    Type.Literal('b'),
    Type.Literal('c')
]), Vector)

const T1 = Type.Record(Type.Number(), Base, { additionalProperties: false })

const C = Type.Intersect([Vector, T0])

type T = Static<typeof C>

function test(value: T) {

}

ok(T1, { 
    '0': 'hello',
    '1': 'hello',
})

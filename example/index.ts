import { Type, Static } from '@sinclair/typebox'
import { ok } from '../spec/schema/validate'

const T = Type.Record(Type.Union([
    Type.Literal('a'),
    Type.Literal('b'),
    Type.Literal('asd')
]), Type.String())

console.log(T)

type T = Static<typeof T>

ok(T, { 
    a: 'hello',
    b: 'hello',
})

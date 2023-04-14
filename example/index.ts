import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

const L = Type.TemplateLiteral([Type.String(), Type.Literal('_foo')])
const R = Type.Record(L, Type.String())
type L = Static<typeof L>
type R = Static<typeof R>
console.log(R)

// const L = Type.TemplateLiteral([Type.Literal('.*')])
// const R = Type.Record(L, Type.String());
// type L = Static<typeof L>
// type R = Static<typeof R>
// console.log(R);

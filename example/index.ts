import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, UnionResolver, TypeGuard, Kind, Static, TNever, TSchema, TUnion } from '@sinclair/typebox'

const U = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
const X = Type.Record(U, Type.Number())

console.log(X)

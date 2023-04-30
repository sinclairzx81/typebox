import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, TUnsafe, TupleToUnion, TThis } from '@sinclair/typebox'

const P = Type.TemplateLiteral('/post/${string}/user/${number}')

console.log(P)

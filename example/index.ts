import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema } from '@sinclair/typebox'

Custom.Set('BigInt', (schema, value) => typeof value === 'bigint')
//            │                               
//            └───────────────────┐                  The [Kind] is used to match custom type
//                                │
const T = Type.Unsafe<bigint>({ [Kind]: 'BigInt' })  // const T = { [Kind]: 'BigInt' }

const A = TypeCompiler.Compile(T).Check(65536)       // const A = false

const B = Value.Check(T, 65536n)                     // const B = true

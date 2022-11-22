import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Static, TSchema, Kind } from '@sinclair/typebox'

Custom.Set('BigInt', (value: unknown) => typeof value === 'bigint')

export const BigInt = Type.Unsafe({ [Kind]: 'BigInt', default: 100n })

export const T = Type.Object({
  num: BigInt
})

const value = Value.Cast(T, { num: 'hello' })
console.log(value)

const C = TypeCompiler.Compile(T)
console.log(C.Code())
console.log(C.Check(1000n))
console.log(Value.Check(T, { num: 100n }))
console.log([...Value.Errors(T, { num: 100n })])

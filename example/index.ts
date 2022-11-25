import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Static, Kind, TSchema } from '@sinclair/typebox'



export interface BigIntOptions {
  min?: bigint
  max?: bigint
}
export interface TBigInt extends TSchema, BigIntOptions {
  [Kind]: 'BigInt'
  static: bigint
}

Custom.Set<TBigInt>('BigInt', (schema, value) => {
  return true
})

export function BigInt(options?: BigIntOptions): TBigInt {
    return { [Kind]: 'BigInt', ...options } as any
}

const T = Type.Object({
  x: BigInt(),
  y: BigInt(),
  z: BigInt(),
})

const C = TypeCompiler.Compile(T)

console.log(C.Code())
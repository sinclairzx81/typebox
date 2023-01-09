import { Codegen } from '@sinclair/typebox/codegen'
import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Conditional } from '@sinclair/typebox/conditional'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema } from '@sinclair/typebox'

export type BigNumberOptions = { minimum: bigint; maximum: bigint }

export const BigNumber = TypeSystem.CreateType<bigint, BigNumberOptions>('BigNumber', (options, value) => {
  if (typeof value !== 'bigint') return false
  if (options.maximum !== undefined && value > options.maximum) return false
  if (options.minimum !== undefined && value < options.minimum) return false
  return true
})
const T = BigNumber({ minimum: 10n, maximum: 20n }) // const T = {
//    minimum: 10n,
//    maximum: 20n,
//    [Symbol(TypeBox.Kind)]: 'BigNumber'
//  }

const C = TypeCompiler.Compile(T)
const X = C.Check(15n) // const X = true
const Y = C.Check(5n) // const Y = false
const Z = C.Check(25n) // const Z = false

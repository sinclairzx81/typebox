import { Ok, Fail } from '../compiler/validate'
import { Assert } from '../assert/index'
import { TypeSystem } from '@sinclair/typebox/system'

describe('system/TypeSystem/CreateType', () => {
  it('Should create and validate a type', () => {
    type BigNumberOptions = { minimum?: bigint; maximum?: bigint }
    const BigNumber = TypeSystem.CreateType<bigint, BigNumberOptions>('CreateType0', (options, value) => {
      if (typeof value !== 'bigint') return false
      if (options.maximum !== undefined && value > options.maximum) return false
      if (options.minimum !== undefined && value < options.minimum) return false
      return true
    })
    const T = BigNumber({ minimum: 10n, maximum: 20n })
    Ok(T, 15n)
    Fail(T, 5n)
    Fail(T, 25n)
  })
  it('Should throw if registering the same type twice', () => {
    TypeSystem.CreateType('CreateType1', () => true)
    Assert.throws(() => TypeSystem.CreateType('CreateType1', () => true))
  })
})

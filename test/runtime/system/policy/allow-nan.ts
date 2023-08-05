import { Ok, Fail } from '../../compiler/validate'
import { TypeSystemPolicy } from '@sinclair/typebox/system'
import { Type } from '@sinclair/typebox'

describe('system/TypeSystemPolicy/AllowNaN', () => {
  beforeEach(() => {
    TypeSystemPolicy.AllowNaN = true
  })
  afterEach(() => {
    TypeSystemPolicy.AllowNaN = false
  })
  // ---------------------------------------------------------------
  // Number
  // ---------------------------------------------------------------
  it('Should validate number with NaN', () => {
    const T = Type.Number()
    Ok(T, NaN)
  })
  it('Should validate number with +Infinity', () => {
    const T = Type.Number()
    Ok(T, Infinity)
  })
  it('Should validate number with -Infinity', () => {
    const T = Type.Number()
    Ok(T, -Infinity)
  })
  // ---------------------------------------------------------------
  // Integer
  //
  // Note: The Number.isInteger() test will fail for NaN. Because
  // of this we cannot reasonably override NaN handling for integers.
  // ---------------------------------------------------------------
  it('Should not validate integer with NaN', () => {
    const T = Type.Integer()
    Fail(T, NaN)
  })
  it('Should not validate integer with +Infinity', () => {
    const T = Type.Integer()
    Fail(T, Infinity)
  })
  it('Should not validate integer with -Infinity', () => {
    const T = Type.Integer()
    Fail(T, -Infinity)
  })
  // ---------------------------------------------------------------
  // BigInt
  //
  // Note: We expect failures here as bigint isn't IEEE754
  // ---------------------------------------------------------------
  it('Should not validate bigint with NaN', () => {
    const T = Type.BigInt()
    Fail(T, NaN)
  })
  it('Should not validate bigint with +Infinity', () => {
    const T = Type.BigInt()
    Fail(T, Infinity)
  })
  it('Should not validate bigint with -Infinity', () => {
    const T = Type.BigInt()
    Fail(T, -Infinity)
  })
})

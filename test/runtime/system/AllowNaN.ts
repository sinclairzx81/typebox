import { Ok, Fail } from '../compiler/validate'
import { TypeSystem } from '@sinclair/typebox/system'
import { Type } from '@sinclair/typebox'

describe('TypeSystem/AllowNaN', () => {
  before(() => {
    TypeSystem.AllowNaN = true
  })
  after(() => {
    TypeSystem.AllowNaN = false
  })
  // ---------------------------------------------------------------
  // Number
  // ---------------------------------------------------------------
  it('Should validate number with NaN', () => {
    const T = Type.Number()
    Ok(T, NaN)
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
})

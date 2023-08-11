import { Ok } from '../../compiler/validate'
import { TypeSystemPolicy } from '@sinclair/typebox/system'
import { Type } from '@sinclair/typebox'

describe('system/TypeSystemPolicy/AllowNullVoid', () => {
  beforeEach(() => {
    TypeSystemPolicy.AllowNullVoid = true
  })
  afterEach(() => {
    TypeSystemPolicy.AllowNullVoid = false
  })
  // ---------------------------------------------------------------
  // Object
  // ---------------------------------------------------------------
  it('Should validate with null', () => {
    const T = Type.Void()
    Ok(T, null)
  })
  it('Should validate with undefined', () => {
    const T = Type.Void()
    Ok(T, undefined)
  })
  it('Should validate with void 0', () => {
    const T = Type.Void()
    Ok(T, void 0)
  })
  it('Should validate with void 1', () => {
    const T = Type.Void()
    Ok(T, void 1)
  })
})

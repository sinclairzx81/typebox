import { Ok, Fail } from '../../compiler/validate'
import { TypeSystemPolicy } from '@sinclair/typebox/system'
import { Type } from '@sinclair/typebox'

describe('system/TypeSystemPolicy/ExactOptionalPropertyTypes', () => {
  beforeEach(() => {
    TypeSystemPolicy.ExactOptionalPropertyTypes = true
  })
  afterEach(() => {
    TypeSystemPolicy.ExactOptionalPropertyTypes = false
  })
  // ---------------------------------------------------------------
  // Number
  // ---------------------------------------------------------------
  it('Should not validate optional number', () => {
    const T = Type.Object({
      x: Type.Optional(Type.Number()),
    })
    Ok(T, {})
    Ok(T, { x: 1 })
    Fail(T, { x: undefined })
  })
  it('Should not validate undefined', () => {
    const T = Type.Object({
      x: Type.Optional(Type.Undefined()),
    })
    Ok(T, {})
    Fail(T, { x: 1 })
    Ok(T, { x: undefined })
  })
  it('Should validate optional number | undefined', () => {
    const T = Type.Object({
      x: Type.Optional(Type.Union([Type.Number(), Type.Undefined()])),
    })
    Ok(T, {})
    Ok(T, { x: 1 })
    Ok(T, { x: undefined })
  })
})

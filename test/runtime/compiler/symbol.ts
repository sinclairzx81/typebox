import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/compiler/Symbol', () => {
  it('Should not validate a boolean', () => {
    const T = Type.Symbol()
    Fail(T, true)
    Fail(T, false)
  })
  it('Should not validate a number', () => {
    const T = Type.Symbol()
    Fail(T, 1)
  })
  it('Should not validate a string', () => {
    const T = Type.Symbol()
    Fail(T, 'true')
  })
  it('Should not validate an array', () => {
    const T = Type.Symbol()
    Fail(T, [true])
  })
  it('Should not validate an object', () => {
    const T = Type.Symbol()
    Fail(T, {})
  })
  it('Should not validate an null', () => {
    const T = Type.Symbol()
    Fail(T, null)
  })
  it('Should not validate an undefined', () => {
    const T = Type.Symbol()
    Fail(T, undefined)
  })
  it('Should not validate bigint', () => {
    const T = Type.Symbol()
    Fail(T, BigInt(1))
  })
  it('Should not validate symbol', () => {
    const T = Type.Symbol()
    Ok(T, Symbol(1))
  })
})

import { Type } from '@sinclair/typebox'
import { Ok } from './validate'

describe('compiler/Argument', () => {
  it('Should validate number', () => {
    const T = Type.Argument(0)
    Ok(T, 1)
  })
  it('Should validate string', () => {
    const T = Type.Argument(0)
    Ok(T, 'hello')
  })
  it('Should validate boolean', () => {
    const T = Type.Argument(0)
    Ok(T, true)
  })
  it('Should validate array', () => {
    const T = Type.Argument(0)
    Ok(T, [1, 2, 3])
  })
  it('Should validate object', () => {
    const T = Type.Argument(0)
    Ok(T, { a: 1, b: 2 })
  })
  it('Should validate null', () => {
    const T = Type.Argument(0)
    Ok(T, null)
  })
  it('Should validate undefined', () => {
    const T = Type.Argument(0)
    Ok(T, undefined)
  })
  it('Should validate bigint', () => {
    const T = Type.Argument(0)
    Ok(T, BigInt(1))
  })
  it('Should validate symbol', () => {
    const T = Type.Argument(0)
    Ok(T, Symbol(1))
  })
})

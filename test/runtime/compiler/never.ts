import { Type } from '@sinclair/typebox'
import { Fail } from './validate'

describe('type/compiler/Never', () => {
  it('Should not validate number', () => {
    const T = Type.Never()
    Fail(T, 1)
  })
  it('Should not validate string', () => {
    const T = Type.Never()
    Fail(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.Never()
    Fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.Never()
    Fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.Never()
    Fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.Never()
    Fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.Never()
    Fail(T, undefined)
  })
  it('Should not validate bigint', () => {
    const T = Type.Never()
    Fail(T, BigInt(1))
  })
  it('Should not validate symbol', () => {
    const T = Type.Never()
    Fail(T, Symbol(1))
  })
})

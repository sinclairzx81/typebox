import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/Literal', () => {
  // -----------------------------------------------------
  // LiteralString
  // -----------------------------------------------------
  const T1 = Type.Literal('hello')
  it('Should pass 0', () => {
    const R = Resolve(T1, 'hello')
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T1, 'world')
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Literal)
  })
  // -----------------------------------------------------
  // LiteralNumber
  // -----------------------------------------------------
  const T2 = Type.Literal(0)
  it('Should pass 2', () => {
    const R = Resolve(T2, 0)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 3', () => {
    const R = Resolve(T2, 1)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Literal)
  })
  // -----------------------------------------------------
  // LiteralBoolean
  // -----------------------------------------------------
  const T3 = Type.Literal(true)
  it('Should pass 4', () => {
    const R = Resolve(T3, true)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 5', () => {
    const R = Resolve(T3, false)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Literal)
  })
})

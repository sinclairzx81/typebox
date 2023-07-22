import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Enum', () => {
  enum Foo {
    A = 1,
    B = 2,
  }
  const T = Type.Enum(Foo)
  it('Should pass enum option A', () => {
    const value = Foo.A
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
  it('Should pass enum option B', () => {
    const value = Foo.A
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
  it('Should fail unknown value', () => {
    const value = 'unknown'
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail Date', () => {
    const value = new Date()
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
})

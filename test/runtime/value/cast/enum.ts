import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Boolean', () => {
  enum Foo {
    A,
    B,
  }
  const T = Type.Enum(Foo)
  const E = Foo.A

  it('Should upcast from string', () => {
    const value = 'hello'
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from number', () => {
    const value = 123
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from boolean', () => {
    const value = true
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from object', () => {
    const value = {}
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })
  it('Should upcast from array', () => {
    const value = [1]
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should upcast from undefined', () => {
    const value = undefined
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should upcast from null', () => {
    const value = null
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, E)
  })

  it('Should upcast from enum A', () => {
    const value = Foo.A
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, Foo.A)
  })

  it('Should upcast from enum B', () => {
    const value = Foo.B
    const result = Value.Cast(T, value)
    Assert.deepEqual(result, Foo.B)
  })
})

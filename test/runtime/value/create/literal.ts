import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Literal', () => {
  it('Should create literal string', () => {
    const T = Type.Literal('hello')
    Assert.IsEqual(Value.Create(T), 'hello')
  })
  it('Should create literal number', () => {
    const T = Type.Literal(1)
    Assert.IsEqual(Value.Create(T), 1)
  })
  it('Should create literal boolean', () => {
    const T = Type.Literal(true)
    Assert.IsEqual(Value.Create(T), true)
  })
  it('Should create literal from default value', () => {
    const T = Type.Literal(true, { default: 'hello' })
    Assert.IsEqual(Value.Create(T), 'hello')
  })
})

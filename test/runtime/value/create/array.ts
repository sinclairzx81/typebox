import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Any', () => {
  it('Should create value', () => {
    const T = Type.Array(Type.String())
    Assert.deepEqual(Value.Create(T), [])
  })
  it('Should create default', () => {
    const T = Type.Array(Type.String(), { default: ['1'] })
    Assert.deepEqual(Value.Create(T), ['1'])
  })
  it('Should create with minItems', () => {
    const T = Type.Array(Type.String(), { minItems: 4 })
    Assert.deepEqual(Value.Create(T), ['', '', '', ''])
  })
})

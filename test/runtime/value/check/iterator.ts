import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Iterator', () => {
  it('Should pass iterator 1', () => {
    function* f() {}
    const T = Type.Iterator(Type.Any())
    const result = Value.Check(T, f())
    Assert.IsEqual(result, true)
  })
  it('Should pass iterator 2', () => {
    const T = Type.Iterator(Type.Any())
    const result = Value.Check(T, {
      [Symbol.iterator]: () => {},
    })
    Assert.IsEqual(result, true)
  })
  it('Should pass iterator', () => {
    const T = Type.Iterator(Type.Any())
    const result = Value.Check(T, {})
    Assert.IsEqual(result, false)
  })
})

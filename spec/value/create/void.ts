import { Value } from '@sidewinder/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Void', () => {
  it('Should create value', () => {
    const T = Type.Void()
    Assert.deepEqual(Value.Create(T), null)
  })
})

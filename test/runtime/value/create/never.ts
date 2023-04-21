import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index.js'

describe('value/create/Never', () => {
  it('Should create value', () => {
    const T = Type.Never()
    Assert.throws(() => Value.Create(T))
  })
})

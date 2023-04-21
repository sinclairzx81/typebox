import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index.js'

describe('value/create/Unknown', () => {
  it('Should create value', () => {
    const T = Type.Unknown()
    Assert.deepEqual(Value.Create(T), {})
  })
  it('Should create default', () => {
    const T = Type.Unknown({ default: 1 })
    Assert.deepEqual(Value.Create(T), 1)
  })
})

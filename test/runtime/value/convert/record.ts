import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Record', () => {
  it('Should convert record value to numeric', () => {
    const T = Type.Record(Type.String(), Type.Number())
    const V = Value.Convert(T, { x: '42', y: '24', z: 'hello' })
    Assert.deepEqual(V, { x: 42, y: '24', z: 'hello' })
  })
})

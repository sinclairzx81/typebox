import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/normal/Record', () => {
  it('Normalize 1', () => {
    const K = Type.Union([Type.Literal('A'), Type.Literal('B')])
    const T = Type.Record(K, Type.String())
    const R = TypeGuard.TObject(T)
    Assert.deepEqual(R, true)
  })
})

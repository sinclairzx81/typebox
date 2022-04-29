import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TSelf', () => {
  it('should guard for TSelf', () => {
    Type.Recursive((T) => {
      const R = TypeGuard.TSelf(T)
      Assert.equal(R, true)
      return Type.Object({ t: Type.Array(T) })
    })
  })
})

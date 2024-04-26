import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TThis', () => {
  it('Should guard for TThis', () => {
    Type.Recursive((This) => {
      const R = KindGuard.IsThis(This)
      Assert.IsTrue(R)
      return Type.Object({ nodes: Type.Array(This) })
    })
  })
})

import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TSelf', () => {
  it('Should guard for TSelf', () => {
    Type.Recursive((Node) => {
      const R = TypeGuard.TSelf(Node)
      Assert.equal(R, true)
      return Type.Object({ nodes: Type.Array(Node) })
    })
  })
  it('Should guard for TSelf with invalid $ref', () => {
    Type.Recursive((Node) => {
      // @ts-ignore
      Node.$ref = 1
      const R = TypeGuard.TSelf(Node)
      Assert.equal(R, false)
      return Type.Object({ nodes: Type.Array(Node) })
    })
  })
})

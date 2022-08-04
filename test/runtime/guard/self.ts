import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TSelf', () => {
  it('should guard for TSelf', () => {
    Type.Recursive((Node) => {
      const R = TypeGuard.TSelf(Node)
      Assert.equal(R, true)
      return Type.Object({ nodes: Type.Array(Node) })
    })
  })
  it('should guard for TSelf with invalid $ref', () => {
    Type.Recursive((Node) => {
      // @ts-ignore
      Node.$ref = 1
      const R = TypeGuard.TSelf(Node)
      Assert.equal(R, false)
      return Type.Object({ nodes: Type.Array(Node) })
    })
  })
})

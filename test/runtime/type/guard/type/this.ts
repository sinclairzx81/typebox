import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TThis', () => {
  it('Should guard for TThis', () => {
    Type.Recursive((This) => {
      const R = TypeGuard.IsThis(This)
      Assert.IsTrue(R)
      return Type.Object({ nodes: Type.Array(This) })
    })
  })
  it('Should guard for TThis with invalid $ref', () => {
    Type.Recursive((This) => {
      // @ts-ignore
      This.$ref = 1
      const R = TypeGuard.IsThis(This)
      Assert.IsFalse(R)
      return Type.Object({ nodes: Type.Array(This) })
    })
  })
})

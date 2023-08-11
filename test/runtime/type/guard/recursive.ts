import { TypeGuard, PatternNumberExact, PatternStringExact, PatternString, PatternNumber } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TRecursive', () => {
  it('Should guard 1', () => {
    const T = Type.Recursive((This) => Type.Object({ nodes: This }))
    Assert.IsTrue(TypeGuard.TRecursive(T))
    Assert.IsTrue(TypeGuard.TObject(T))
  })
  it('Should guard 2', () => {
    const T = Type.Recursive((This) => Type.Tuple([This]))
    Assert.IsTrue(TypeGuard.TRecursive(T))
    Assert.IsTrue(TypeGuard.TTuple(T))
  })
})

import { KindGuard, PatternNumberExact, PatternStringExact, PatternString, PatternNumber } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TRecursive', () => {
  it('Should guard 1', () => {
    const T = Type.Recursive((This) => Type.Object({ nodes: This }))
    Assert.IsTrue(KindGuard.IsRecursive(T))
    Assert.IsTrue(KindGuard.IsObject(T))
  })
  it('Should guard 2', () => {
    const T = Type.Recursive((This) => Type.Tuple([This]))
    Assert.IsTrue(KindGuard.IsRecursive(T))
    Assert.IsTrue(KindGuard.IsTuple(T))
  })
})

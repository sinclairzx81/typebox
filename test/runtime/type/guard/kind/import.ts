import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TImport', () => {
  it('Should guard for TImport', () => {
    const M = Type.Module({
      A: Type.String(),
    })
    const I = M.Import('A')
    const N = I.$defs[I.$ref]
    Assert.IsTrue(KindGuard.IsImport(I))
    Assert.IsTrue(KindGuard.IsString(N))
  })
})

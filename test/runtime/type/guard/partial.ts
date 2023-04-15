import { TypeSystem } from '@sinclair/typebox/system'
import { TypeGuard } from '@sinclair/typebox'
import { Type, Kind } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TPartial', () => {
  // -------------------------------------------------------------------------
  // case: https://github.com/sinclairzx81/typebox/issues/364
  // -------------------------------------------------------------------------
  it('Should support TUnsafe partial properties with no Kind', () => {
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ x: 1 }) }))
    Assert.deepEqual(T.required, undefined)
  })
  it('Should support TUnsafe partial properties with unregistered Kind', () => {
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ [Kind]: 'UnknownPartialType', x: 1 }) }))
    Assert.deepEqual(T.required, undefined)
  })
  it('Should support TUnsafe partial properties with registered Kind', () => {
    const U = TypeSystem.Type('CustomPartialType', () => true)
    const T = Type.Partial(Type.Object({ x: U() }))
    Assert.deepEqual(T.required, undefined)
  })
})

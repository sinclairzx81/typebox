import { TypeGuard } from '@sinclair/typebox'
import { Type, Kind } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TPick', () => {
  // -------------------------------------------------------------------------
  // case: https://github.com/sinclairzx81/typebox/issues/384
  // -------------------------------------------------------------------------
  it('Should support TUnsafe omit properties with no Kind', () => {
    const T = Type.Pick(Type.Object({ x: Type.Unsafe({ x: 1 }), y: Type.Number() }), ['x'])
    Assert.deepEqual(T.required, ['x'])
  })
  it('Should support TUnsafe omit properties with unregistered Kind', () => {
    const T = Type.Pick(Type.Object({ x: Type.Unsafe({ x: 1, [Kind]: 'UnknownPickType' }), y: Type.Number() }), ['x'])
    Assert.deepEqual(T.required, ['x'])
  })
})

import { TypeGuard } from '@sinclair/typebox'
import { Type, Kind } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TOmit', () => {
  // -------------------------------------------------------------------------
  // case: https://github.com/sinclairzx81/typebox/issues/384
  // -------------------------------------------------------------------------
  it('Should support TUnsafe omit properties with no Kind', () => {
    const T = Type.Omit(Type.Object({ x: Type.Unsafe({ x: 1 }), y: Type.Number() }), ['x'])
    Assert.deepEqual(T.required, ['y'])
  })
  it('Should support TUnsafe omit properties with unregistered Kind', () => {
    const T = Type.Omit(Type.Object({ x: Type.Unsafe({ x: 1, [Kind]: 'UnknownOmitType' }), y: Type.Number() }), ['x'])
    Assert.deepEqual(T.required, ['y'])
  })
})

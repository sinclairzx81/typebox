import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TUint8Array', () => {
  it('Should guard for TUint8Array', () => {
    const R = TypeGuard.TUint8Array(Type.Uint8Array())
    Assert.isEqual(R, true)
  })

  it('Should not guard for TUint8Array', () => {
    const R = TypeGuard.TUint8Array(null)
    Assert.isEqual(R, false)
  })

  it('Should not guard for TUint8Array with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TUint8Array(Type.Uint8Array({ $id: 1 }))
    Assert.isEqual(R, false)
  })

  it('Should not guard for TUint8Array with invalid minByteLength', () => {
    // @ts-ignore
    const R = TypeGuard.TUint8Array(Type.Uint8Array({ minByteLength: '1' }))
    Assert.isEqual(R, false)
  })

  it('Should not guard for TUint8Array with invalid maxByteLength', () => {
    // @ts-ignore
    const R = TypeGuard.TUint8Array(Type.Uint8Array({ maxByteLength: '1' }))
    Assert.isEqual(R, false)
  })
})

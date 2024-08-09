import { TypeSystemPolicy } from '@sinclair/typebox/system'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('system/TypeSystemPolicy/InstanceMode', () => {
  after(() => {
    TypeSystemPolicy.InstanceMode = 'freeze'
  })
  // ---------------------------------------------------------------
  // Number
  // ---------------------------------------------------------------
  it('Should use instance mode default', () => {
    TypeSystemPolicy.InstanceMode = 'default'
    const S = Type.String()
    const T = Type.Array(S)
    S.$id = 'updated'
    Assert.IsEqual(T.items.$id, 'updated')
  })
  it('Should use instance mode clone', () => {
    TypeSystemPolicy.InstanceMode = 'clone'
    const S = Type.String()
    const T = Type.Array(S)
    S.$id = 'updated'
    Assert.IsEqual(T.items.$id, undefined)
  })
  it('Should use instance mode freeze', () => {
    TypeSystemPolicy.InstanceMode = 'freeze'
    Assert.Throws(() => {
      const S = Type.String()
      const T = Type.Array(S)
      S.$id = 'updated'
    })
  })
})

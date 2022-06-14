import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Uint8Array', () => {
  it('Should create value', () => {
    const T = Type.Uint8Array()
    const value = Value.Create(T)
    Assert.isInstanceOf(value, Uint8Array)
    Assert.equal(value.length, 0)
  })

  it('Should create default', () => {
    const T = Type.Uint8Array({ default: new Uint8Array([0, 1, 2, 3]) })
    const value = Value.Create(T)
    Assert.isInstanceOf(value, Uint8Array)
    Assert.equal(value.length, 4)
    Assert.deepEqual([value[0], value[1], value[2], value[3]], [0, 1, 2, 3])
  })

  it('Should create with minByteLength', () => {
    const T = Type.Uint8Array({ minByteLength: 4 })
    const value = Value.Create(T)
    Assert.isInstanceOf(value, Uint8Array)
    Assert.equal(value.length, 4)
    Assert.deepEqual([value[0], value[1], value[2], value[3]], [0, 0, 0, 0])
  })
})

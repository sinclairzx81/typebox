import { Value } from '@sinclair/typebox/value'
import { TypeSystem } from '@sinclair/typebox/system'
import { Assert } from '../../assert/index'

describe('value/convert/Custom', () => {
  it('Should not convert 1', () => {
    const Custom = TypeSystem.Type('type/convert/Custom/1', () => true)
    const T = Custom()
    const R = Value.Convert(T, true)
    Assert.deepEqual(R, true)
  })
  it('Should not convert 2', () => {
    const Custom = TypeSystem.Type('type/convert/Custom/2', () => true)
    const T = Custom()
    const R = Value.Convert(T, 42)
    Assert.deepEqual(R, 42)
  })
  it('Should not convert 3', () => {
    const Custom = TypeSystem.Type('type/convert/Custom/3', () => true)
    const T = Custom()
    const R = Value.Convert(T, 'hello')
    Assert.deepEqual(R, 'hello')
  })
})

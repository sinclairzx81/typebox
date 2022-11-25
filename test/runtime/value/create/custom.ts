import { Value } from '@sinclair/typebox/value'
import { Type, Kind } from '@sinclair/typebox'
import { Custom } from '@sinclair/typebox/custom'
import { Assert } from '../../assert/index'

describe('value/create/Custom', () => {
  it('Should create custom value with default', () => {
    Custom.Set('CustomCreate1', () => true)
    const T = Type.Unsafe({ [Kind]: 'CustomCreate1', default: 'hello' })
    Assert.deepEqual(Value.Create(T), 'hello')
  })

  it('Should throw when no default value is specified', () => {
    Custom.Set('CustomCreate2', () => true)
    const T = Type.Unsafe({ [Kind]: 'CustomCreate2' })
    Assert.throws(() => Value.Create(T))
  })
})

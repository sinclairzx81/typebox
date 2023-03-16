import { Value } from '@sinclair/typebox/value'
import { Type, Kind, TypeRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Custom', () => {
  it('Should create custom value with default', () => {
    TypeRegistry.Set('CustomCreate1', () => true)
    const T = Type.Unsafe({ [Kind]: 'CustomCreate1', default: 'hello' })
    Assert.deepEqual(Value.Create(T), 'hello')
  })

  it('Should throw when no default value is specified', () => {
    TypeRegistry.Set('CustomCreate2', () => true)
    const T = Type.Unsafe({ [Kind]: 'CustomCreate2' })
    Assert.throws(() => Value.Create(T))
  })
})

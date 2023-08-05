import { Value } from '@sinclair/typebox/value'
import { Type, Kind, TypeRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Kind', () => {
  // ---------------------------------------------------------
  // Fixtures
  // ---------------------------------------------------------
  beforeEach(() => TypeRegistry.Set('Kind', () => true))
  afterEach(() => TypeRegistry.Delete('Kind'))
  // ---------------------------------------------------------
  // Tests
  // ---------------------------------------------------------
  it('Should create custom value with default', () => {
    const T = Type.Unsafe({ [Kind]: 'Kind', default: 'hello' })
    Assert.IsEqual(Value.Create(T), 'hello')
  })
  it('Should throw when no default value is specified', () => {
    TypeRegistry.Set('Kind', () => true)
    const T = Type.Unsafe({ [Kind]: 'Kind' })
    Assert.Throws(() => Value.Create(T))
  })
})

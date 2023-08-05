import { Value } from '@sinclair/typebox/value'
import { TypeRegistry, Kind, TSchema } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Kind', () => {
  // ---------------------------------------------------------
  // Fixtures
  // ---------------------------------------------------------
  beforeEach(() => TypeRegistry.Set('Kind', () => true))
  afterEach(() => TypeRegistry.Delete('Kind'))
  // ---------------------------------------------------------
  // Test
  // ---------------------------------------------------------
  it('Should not convert value 1', () => {
    const T = { [Kind]: 'Kind' } as TSchema
    const R = Value.Convert(T, true)
    Assert.IsEqual(R, true)
  })
  it('Should not convert value 2', () => {
    const T = { [Kind]: 'Kind' } as TSchema
    const R = Value.Convert(T, 42)
    Assert.IsEqual(R, 42)
  })
  it('Should not convert value 3', () => {
    const T = { [Kind]: 'Kind' } as TSchema
    const R = Value.Convert(T, 'hello')
    Assert.IsEqual(R, 'hello')
  })
  it('Should not convert value 4', () => {
    const T = { [Kind]: 'Kind' } as TSchema
    const R = Value.Convert(T, { x: 1 })
    Assert.IsEqual(R, { x: 1 })
  })
  it('Should not convert value 5', () => {
    const T = { [Kind]: 'Kind' } as TSchema
    const R = Value.Convert(T, [0, 1])
    Assert.IsEqual(R, [0, 1])
  })
})

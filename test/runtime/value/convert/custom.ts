import { Value } from '@sinclair/typebox/value'
import { Kind, TSchema, ConvertRegistry, Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Custom', () => {
  // ---------------------------------------------------------
  // Fixtures
  // ---------------------------------------------------------
  afterEach(() => ConvertRegistry.Clear())
  // ---------------------------------------------------------
  // Test
  // ---------------------------------------------------------
  it('Should convert value with a function', () => {
    const T = { [Kind]: 'Custom' } as TSchema
    ConvertRegistry.Set('Custom', (_, t) => !t)
    const R = Value.Convert(T, true)
    Assert.IsEqual(R, false)
  })
  it('Should convert value using params', () => {
    const T = { [Kind]: 'Custom', params: ['a'] } as TSchema
    ConvertRegistry.Set('Custom', (s, t) => `${s.params[0]}_${t}`)
    const R = Value.Convert(T, "test")
    Assert.IsEqual(R, "a_test")
  })

  it('Should convert value using injected data', () => {
    const T = { [Kind]: 'Custom' } as TSchema
    ConvertRegistry.Set('Custom', (_s, t, v) => `${v}_${t}`)
    const R = Value.Convert(T, [], "test", new Map([['Custom', 'b']]))
    Assert.IsEqual(R, "b_test")
  })

  it('Should convert nested value using injected data', () => {
    const T = Type.Object({
      t: { [Kind]: 'Custom' } as TSchema
    })
    ConvertRegistry.Set('Custom', (_s, t, v) => `${v}_${t}`)
    const R = Value.Convert(T, [], { t: "test" }, new Map([['Custom', 'b']]))
    Assert.IsEqual(R, { t: "b_test" })
  })
})

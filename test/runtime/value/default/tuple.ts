import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/Tuple', () => {
  it('Should use default', () => {
    const T = Type.Tuple([Type.Number(), Type.Number()], { default: 1 })
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Tuple([Type.Number(), Type.Number()], { default: 1 })
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // Elements
  // ----------------------------------------------------------------
  it('Should use default elements 1', () => {
    const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })], { default: [] })
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  it('Should use default elements 2', () => {
    const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })], { default: [] })
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, [1, 2])
  })
  it('Should use default elements 3', () => {
    const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })], { default: [] })
    const R = Value.Default(T, [4, 5, 6])
    Assert.IsEqual(R, [4, 5, 6])
  })
  it('Should use default elements 4', () => {
    const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })])
    const R = Value.Default(T, [4, 5, 6])
    Assert.IsEqual(R, [4, 5, 6])
  })
  it('Should use default elements 5', () => {
    const T = Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 2 })])
    const R = Value.Default(T, [4])
    Assert.IsEqual(R, [4, 2])
  })
})

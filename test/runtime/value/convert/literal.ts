import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/LiteralString', () => {
  it('Should convert from number 1', () => {
    const T = Type.Literal('1')
    const R = Value.Convert(T, 1)
    Assert.IsEqual(R, '1')
  })
  it('Should convert from number 2', () => {
    const T = Type.Literal('1')
    const R = Value.Convert(T, 2)
    Assert.IsEqual(R, 2)
  })
  it('Should convert from boolean', () => {
    const T = Type.Literal('true')
    const R = Value.Convert(T, true)
    Assert.IsEqual(R, 'true')
  })
})
describe('value/convert/LiteralNumber', () => {
  it('Should convert from number 1', () => {
    const T = Type.Literal(3.14)
    const R = Value.Convert(T, '3.14')
    Assert.IsEqual(R, 3.14)
  })
  it('Should convert from number 2', () => {
    const T = Type.Literal(3.14)
    const R = Value.Convert(T, '3.15')
    Assert.IsEqual(R, '3.15')
  })
  it('Should convert from boolean 1', () => {
    const T = Type.Literal(1)
    const R = Value.Convert(T, true)
    Assert.IsEqual(R, 1)
  })
  it('Should convert from boolean 2', () => {
    const T = Type.Literal(0)
    const R = Value.Convert(T, false)
    Assert.IsEqual(R, 0)
  })
  it('Should convert from boolean 3', () => {
    const T = Type.Literal(2)
    const R = Value.Convert(T, true)
    Assert.IsEqual(R, true)
  })
})
describe('value/convert/LiteralBoolean', () => {
  it('Should convert from number 1', () => {
    const T = Type.Literal(true)
    const R = Value.Convert(T, 3.14)
    Assert.IsEqual(R, 3.14)
  })
  it('Should convert from number 2', () => {
    const T = Type.Literal(true)
    const R = Value.Convert(T, 1)
    Assert.IsEqual(R, true)
  })
  it('Should convert from string 1', () => {
    const T = Type.Literal(true)
    const R = Value.Convert(T, 'true')
    Assert.IsEqual(R, true)
  })
  it('Should convert from string 2', () => {
    const T = Type.Literal(false)
    const R = Value.Convert(T, 'false')
    Assert.IsEqual(R, false)
  })
  it('Should convert from string 3', () => {
    const T = Type.Literal(true)
    const R = Value.Convert(T, '1')
    Assert.IsEqual(R, true)
  })
  it('Should convert from string 4', () => {
    const T = Type.Literal(false)
    const R = Value.Convert(T, '0')
    Assert.IsEqual(R, false)
  })
  it('Should convert from string 5', () => {
    const T = Type.Literal(false)
    const R = Value.Convert(T, '2')
    Assert.IsEqual(R, '2')
  })
})

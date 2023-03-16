import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Literal:String', () => {
  it('Should convert from number 1', () => {
    const T = Type.Literal('1')
    const R = Value.Convert(T, 1)
    Assert.deepEqual(R, '1')
  })
  it('Should convert from number 2', () => {
    const T = Type.Literal('1')
    const R = Value.Convert(T, 2)
    Assert.deepEqual(R, 2)
  })
  it('Should convert from boolean', () => {
    const T = Type.Literal('true')
    const R = Value.Convert(T, true)
    Assert.deepEqual(R, 'true')
  })
})
describe('value/convert/Literal:Number', () => {
  it('Should convert from number 1', () => {
    const T = Type.Literal(3.14)
    const R = Value.Convert(T, '3.14')
    Assert.deepEqual(R, 3.14)
  })
  it('Should convert from number 2', () => {
    const T = Type.Literal(3.14)
    const R = Value.Convert(T, '3.15')
    Assert.deepEqual(R, '3.15')
  })
  it('Should convert from boolean 1', () => {
    const T = Type.Literal(1)
    const R = Value.Convert(T, true)
    Assert.deepEqual(R, 1)
  })
  it('Should convert from boolean 2', () => {
    const T = Type.Literal(0)
    const R = Value.Convert(T, false)
    Assert.deepEqual(R, 0)
  })
  it('Should convert from boolean 3', () => {
    const T = Type.Literal(2)
    const R = Value.Convert(T, true)
    Assert.deepEqual(R, true)
  })
})
describe('value/convert/Literal:Boolean', () => {
  it('Should convert from number 1', () => {
    const T = Type.Literal(true)
    const R = Value.Convert(T, 3.14)
    Assert.deepEqual(R, 3.14)
  })
  it('Should convert from number 2', () => {
    const T = Type.Literal(true)
    const R = Value.Convert(T, 1)
    Assert.deepEqual(R, true)
  })
  it('Should convert from string 1', () => {
    const T = Type.Literal(true)
    const R = Value.Convert(T, 'true')
    Assert.deepEqual(R, true)
  })
  it('Should convert from string 2', () => {
    const T = Type.Literal(false)
    const R = Value.Convert(T, 'false')
    Assert.deepEqual(R, false)
  })
  it('Should convert from string 3', () => {
    const T = Type.Literal(true)
    const R = Value.Convert(T, '1')
    Assert.deepEqual(R, true)
  })
  it('Should convert from string 4', () => {
    const T = Type.Literal(false)
    const R = Value.Convert(T, '0')
    Assert.deepEqual(R, false)
  })
  it('Should convert from string 5', () => {
    const T = Type.Literal(false)
    const R = Value.Convert(T, '2')
    Assert.deepEqual(R, '2')
  })
})

import { Value } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/equal/Equal', () => {
  it('Should equal null value', () => {
    const R = Value.Equal(null, null)
    Assert.IsTrue(R)
  })
  it('Should not equal null value', () => {
    const R = Value.Equal(null, 'null')
    Assert.IsFalse(R)
  })
  it('Should equal undefined value', () => {
    const R = Value.Equal(undefined, undefined)
    Assert.IsTrue(R)
  })
  it('Should not equal undefined value', () => {
    const R = Value.Equal(undefined, 'undefined')
    Assert.IsFalse(R)
  })
  it('Should equal symbol value', () => {
    const S1 = Symbol.for('test')
    const S2 = Symbol.for('test')
    const R = Value.Equal(S1, S2)
    Assert.IsTrue(R)
  })
  it('Should not equal symbol value', () => {
    const S1 = Symbol('test')
    const S2 = Symbol('test')
    const R = Value.Equal(S1, S2)
    Assert.IsFalse(R)
  })
  it('Should equal string value', () => {
    const R = Value.Equal('hello', 'hello')
    Assert.IsTrue(R)
  })
  it('Should not equal string value', () => {
    const R = Value.Equal('hello', 'world')
    Assert.IsFalse(R)
  })
  it('Should equal number value', () => {
    const R = Value.Equal(1, 1)
    Assert.IsTrue(R)
  })
  it('Should not equal number value', () => {
    const R = Value.Equal(1, 2)
    Assert.IsFalse(R)
  })
  it('Should equal boolean value', () => {
    const R = Value.Equal(true, true)
    Assert.IsTrue(R)
  })
  it('Should not equal boolean value', () => {
    const R = Value.Equal(true, false)
    Assert.IsFalse(R)
  })
  it('Should equal array value', () => {
    const R = Value.Equal([0, 1, 2], [0, 1, 2])
    Assert.IsTrue(R)
  })
  it('Should not equal array value', () => {
    const R = Value.Equal([0, 1, 2], [0, 1, 3])
    Assert.IsFalse(R)
  })
  it('Should not equal array value with additional elements', () => {
    const R = Value.Equal([0, 1, 2], [0, 1, 2, 3])
    Assert.IsFalse(R)
  })
  it('Should equal object value', () => {
    const R = Value.Equal({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })
    Assert.IsTrue(R)
  })
  it('Should not equal object value', () => {
    const R = Value.Equal({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 4 })
    Assert.IsFalse(R)
  })
  it('Should not equal object value with additional properties', () => {
    const R = Value.Equal({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3, w: 1 })
    Assert.IsFalse(R)
  })
  it('Should equal typed array value', () => {
    const R = Value.Equal(new Uint8Array([0, 1, 2]), new Uint8Array([0, 1, 2]))
    Assert.IsTrue(R)
  })
  it('Should not equal typed array value', () => {
    const R = Value.Equal(new Uint8Array([0, 1, 2]), new Uint8Array([0, 1, 3]))
    Assert.IsFalse(R)
  })
  it('Should not equal typed array value with varying type', () => {
    const R = Value.Equal(new Uint8Array([0, 1, 2]), new Int8Array([0, 1, 2]))
    Assert.IsFalse(R)
  })
})

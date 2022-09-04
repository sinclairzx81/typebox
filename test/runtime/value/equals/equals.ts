import { Value } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/equals/Equals', () => {
  it('Should equal null value', () => {
    const R = Value.Equals(null, null)
    Assert.deepEqual(R, true)
  })

  it('Should not equal null value', () => {
    const R = Value.Equals(null, 'null')
    Assert.deepEqual(R, false)
  })

  it('Should equal undefined value', () => {
    const R = Value.Equals(undefined, undefined)
    Assert.deepEqual(R, true)
  })

  it('Should not equal undefined value', () => {
    const R = Value.Equals(undefined, 'undefined')
    Assert.deepEqual(R, false)
  })

  it('Should equal symbol value', () => {
    const S1 = Symbol.for('test')
    const S2 = Symbol.for('test')
    const R = Value.Equals(S1, S2)
    Assert.deepEqual(R, true)
  })

  it('Should not equal symbol value', () => {
    const S1 = Symbol('test')
    const S2 = Symbol('test')
    const R = Value.Equals(S1, S2)
    Assert.deepEqual(R, false)
  })

  it('Should equal string value', () => {
    const R = Value.Equals('hello', 'hello')
    Assert.deepEqual(R, true)
  })
  it('Should not equal string value', () => {
    const R = Value.Equals('hello', 'world')
    Assert.deepEqual(R, false)
  })

  it('Should equal number value', () => {
    const R = Value.Equals(1, 1)
    Assert.deepEqual(R, true)
  })

  it('Should not equal number value', () => {
    const R = Value.Equals(1, 2)
    Assert.deepEqual(R, false)
  })

  it('Should equal boolean value', () => {
    const R = Value.Equals(true, true)
    Assert.deepEqual(R, true)
  })

  it('Should not equal boolean value', () => {
    const R = Value.Equals(true, false)
    Assert.deepEqual(R, false)
  })

  it('Should equal array value', () => {
    const R = Value.Equals([0, 1, 2], [0, 1, 2])
    Assert.deepEqual(R, true)
  })

  it('Should not equal array value', () => {
    const R = Value.Equals([0, 1, 2], [0, 1, 3])
    Assert.deepEqual(R, false)
  })

  it('Should not equal array value with additional elements', () => {
    const R = Value.Equals([0, 1, 2], [0, 1, 2, 3])
    Assert.deepEqual(R, false)
  })

  it('Should equal object value', () => {
    const R = Value.Equals({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })
    Assert.deepEqual(R, true)
  })

  it('Should not equal object value', () => {
    const R = Value.Equals({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 4 })
    Assert.deepEqual(R, false)
  })

  it('Should not equal object value with additional properties', () => {
    const R = Value.Equals({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3, w: 1 })
    Assert.deepEqual(R, false)
  })

  it('Should equal typed array value', () => {
    const R = Value.Equals(new Uint8Array([0, 1, 2]), new Uint8Array([0, 1, 2]))
    Assert.deepEqual(R, true)
  })

  it('Should not equal typed array value', () => {
    const R = Value.Equals(new Uint8Array([0, 1, 2]), new Uint8Array([0, 1, 3]))
    Assert.deepEqual(R, false)
  })
  it('Should not equal typed array value with varying type', () => {
    const R = Value.Equals(new Uint8Array([0, 1, 2]), new Int8Array([0, 1, 2]))
    Assert.deepEqual(R, false)
  })
})

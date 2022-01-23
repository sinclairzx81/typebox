import { Value } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/clone/Clone', () => {
  // --------------------------------------------
  // ValueType
  // --------------------------------------------
  it('Should clone null', () => {
    const R = Value.Clone(null)
    Assert.deepEqual(R, null)
  })

  it('Should clone undefined', () => {
    const R = Value.Clone(undefined)
    Assert.deepEqual(R, undefined)
  })

  it('Should clone number', () => {
    const R = Value.Clone(1)
    Assert.deepEqual(R, 1)
  })

  it('Should clone bigint', () => {
    const R = Value.Clone(1n)
    Assert.deepEqual(R, 1n)
  })

  it('Should clone boolean', () => {
    const R = Value.Clone(true)
    Assert.deepEqual(R, true)
  })

  it('Should clone string', () => {
    const R = Value.Clone('hello')
    Assert.deepEqual(R, 'hello')
  })

  it('Should clone symbol', () => {
    const S = Symbol('hello')
    const R = Value.Clone(S)
    Assert.deepEqual(R, S)
  })

  // --------------------------------------------
  // ObjectType
  // --------------------------------------------

  it('Should clone object #1', () => {
    const V = {
      x: 1,
      y: 2,
      z: 3,
    }
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone object #2', () => {
    const V = {
      x: 1,
      y: 2,
      z: 3,
      w: {
        a: 1,
        b: 2,
        c: 3,
      },
    }
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone object #3', () => {
    const V = {
      x: 1,
      y: 2,
      z: 3,
      w: [0, 1, 2, 3, 4],
    }
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })
  // --------------------------------------------
  // ArrayType
  // --------------------------------------------
  it('Should clone array #1', () => {
    const V = [1, 2, 3, 4]
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })
  it('Should clone array #2', () => {
    const V = [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ]
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })
  it('Should clone array #3', () => {
    const V = [
      { x: 1, y: 2, z: 3 },
      { x: 1, y: 2, z: 3 },
      { x: 1, y: 2, z: 3 },
      { x: 1, y: 2, z: 3 },
    ]
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone Int8Array', () => {
    const V = new Int8Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone Uint8Array', () => {
    const V = new Uint8Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone Uint8ClampedArray', () => {
    const V = new Uint8ClampedArray([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone Int16Array', () => {
    const V = new Int16Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone Uint16Array', () => {
    const V = new Uint16Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone Int32Array', () => {
    const V = new Int32Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone Uint32Array', () => {
    const V = new Int32Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone Float32Array', () => {
    const V = new Float32Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone Float64Array', () => {
    const V = new Float64Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone BigInt64Array', () => {
    const V = new BigInt64Array([1n, 2n, 3n, 4n])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })

  it('Should clone BigUint64Array', () => {
    const V = new BigUint64Array([1n, 2n, 3n, 4n])
    const R = Value.Clone(V)
    Assert.deepEqual(R, V)
  })
})

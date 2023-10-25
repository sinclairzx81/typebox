import { Type } from '@sinclair/typebox'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/ObjectPointerProperty', () => {
  // ----------------------------------------------------------------
  // Known
  // ----------------------------------------------------------------
  it('Should produce known pointer property path 1', () => {
    const T = Type.Object({ 'a/b': Type.String() })
    const R = Resolve(T, { 'a/b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~1b')
  })
  it('Should produce known pointer property path 2', () => {
    const T = Type.Object({ 'a~b': Type.String() })
    const R = Resolve(T, { 'a~b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~0b')
  })
  it('Should produce known pointer property path 3', () => {
    const T = Type.Object({ 'a/b~c': Type.String() })
    const R = Resolve(T, { 'a/b~c': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~1b~0c')
  })
  it('Should produce known pointer property path 4', () => {
    const T = Type.Object({ 'a~b/c': Type.String() })
    const R = Resolve(T, { 'a~b/c': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~0b~1c')
  })
  it('Should produce known pointer property path 5', () => {
    const T = Type.Object({ 'a~b/c/d': Type.String() })
    const R = Resolve(T, { 'a~b/c/d': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~0b~1c~1d')
  })
  it('Should produce known pointer property path 6', () => {
    const T = Type.Object({ 'a~b/c/d~e': Type.String() })
    const R = Resolve(T, { 'a~b/c/d~e': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~0b~1c~1d~0e')
  })
  // ----------------------------------------------------------------
  // Unknown Additional
  // ----------------------------------------------------------------
  it('Should produce unknown pointer property path 1', () => {
    const T = Type.Object({}, { additionalProperties: false })
    const R = Resolve(T, { 'a/b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~1b')
  })
  it('Should produce unknown pointer property path 2', () => {
    const T = Type.Object({}, { additionalProperties: false })
    const R = Resolve(T, { 'a~b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~0b')
  })
  // ----------------------------------------------------------------
  // Unknown Constrained
  // ----------------------------------------------------------------
  it('Should produce unknown constrained pointer property path 1', () => {
    const T = Type.Object({}, { additionalProperties: Type.String() })
    const R = Resolve(T, { 'a/b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~1b')
  })
  it('Should produce unknown constrained pointer property path 2', () => {
    const T = Type.Object({}, { additionalProperties: Type.String() })
    const R = Resolve(T, { 'a~b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~0b')
  })
  // ----------------------------------------------------------------
  // Nested
  // ----------------------------------------------------------------
  it('Should produce nested pointer 1', () => {
    const T = Type.Object({
      'x/y': Type.Object({
        z: Type.Object({
          w: Type.String(),
        }),
      }),
    })
    const R = Resolve(T, { 'x/y': { z: { w: 1 } } })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/x~1y/z/w')
  })
  it('Should produce nested pointer 2', () => {
    const T = Type.Object({
      x: Type.Object({
        'y/z': Type.Object({
          w: Type.String(),
        }),
      }),
    })
    const R = Resolve(T, { x: { 'y/z': { w: 1 } } })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/x/y~1z/w')
  })
  it('Should produce nested pointer 3', () => {
    const T = Type.Object({
      x: Type.Object({
        y: Type.Object({
          'z/w': Type.String(),
        }),
      }),
    })
    const R = Resolve(T, { x: { y: { 'z/w': 1 } } })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/x/y/z~1w')
  })
  // ----------------------------------------------------------------
  // Nested Array
  // ----------------------------------------------------------------
  it('Should produce nested array pointer property path 1', () => {
    const T = Type.Object({
      'x/y': Type.Object({
        z: Type.Array(Type.String()),
      }),
    })
    const R = Resolve(T, { 'x/y': { z: ['a', 'b', 1] } })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/x~1y/z/2')
  })
  it('Should produce nested array pointer property path 2', () => {
    const T = Type.Object({
      x: Type.Array(
        Type.Object({
          'y/z': Type.String(),
        }),
      ),
    })
    const R = Resolve(T, { x: [{ 'y/z': 'a' }, { 'y/z': 'b' }, { 'y/z': 1 }] })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/x/2/y~1z')
  })
})

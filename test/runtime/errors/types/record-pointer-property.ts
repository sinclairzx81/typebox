import { Type } from '@sinclair/typebox'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/RecordPointerProperty', () => {
  // ----------------------------------------------------------------
  // Known
  // ----------------------------------------------------------------
  it('Should produce known pointer property path 1', () => {
    const T = Type.Record(Type.String(), Type.String())
    const R = Resolve(T, { 'a/b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~1b')
  })
  it('Should produce known pointer property path 2', () => {
    const T = Type.Record(Type.String(), Type.String())
    const R = Resolve(T, { 'a~b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~0b')
  })
  // ----------------------------------------------------------------
  // Unknown
  // ----------------------------------------------------------------
  it('Should produce unknown pointer property path 1', () => {
    const T = Type.Record(Type.Number(), Type.String(), {
      additionalProperties: false,
    })
    const R = Resolve(T, { 'a/b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~1b')
  })
  it('Should produce unknown pointer property path 1', () => {
    const T = Type.Record(Type.Number(), Type.String(), {
      additionalProperties: false,
    })
    const R = Resolve(T, { 'a~b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~0b')
  })
  // ----------------------------------------------------------------
  // Unknown Constrained
  // ----------------------------------------------------------------
  it('Should produce unknown constrained pointer property path 1', () => {
    const T = Type.Record(Type.Number(), Type.String(), {
      additionalProperties: Type.String(),
    })
    const R = Resolve(T, { 'a/b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~1b')
  })
  it('Should produce unknown constrained pointer property path 1', () => {
    const T = Type.Record(Type.Number(), Type.String(), {
      additionalProperties: Type.String(),
    })
    const R = Resolve(T, { 'a~b': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/a~0b')
  })
  // ----------------------------------------------------------------
  // PatternProperties
  // ----------------------------------------------------------------
  it('Should produce pattern pointer property path 1', () => {
    const T = Type.Record(Type.TemplateLiteral('${string}/${string}/c'), Type.String(), {
      additionalProperties: false,
    })
    const R = Resolve(T, { 'x/y/z': 1 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].path, '/x~1y~1z')
  })
})

import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/Object', () => {
  // -----------------------------------------------------------------
  // Object
  // -----------------------------------------------------------------
  const T1 = Type.Object({ x: Type.Number(), y: Type.Number() })
  it('Should pass 0', () => {
    const R = Resolve(T1, { x: 1, y: 2 })
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T1, null)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Object)
  })
  // -----------------------------------------------------------------
  // Object: Optional
  // -----------------------------------------------------------------
  const T2 = Type.Object({ x: Type.Optional(Type.Number()) })
  it('Should pass 2', () => {
    const R = Resolve(T2, {})
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 3', () => {
    const R = Resolve(T2, { x: 1 })
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 4', () => {
    const R = Resolve(T2, { x: '' })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Number)
    Assert.IsEqual(R[0].path, '/x')
    Assert.IsEqual(R[0].value, '')
  })
  // -----------------------------------------------------------------
  // Object: Optional Multiple
  // -----------------------------------------------------------------
  const T3 = Type.Partial(Type.Object({ x: Type.Number(), y: Type.Number() }))
  it('Should pass 5', () => {
    const R = Resolve(T3, {})
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 6', () => {
    const R = Resolve(T3, { x: 1 })
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 7', () => {
    const R = Resolve(T3, { y: 1 })
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 8', () => {
    const R = Resolve(T3, { x: 'a', y: 'b' })
    Assert.IsEqual(R.length, 2)
    Assert.IsEqual(R[0].type, ValueErrorType.Number)
    Assert.IsEqual(R[0].path, '/x')
    Assert.IsEqual(R[0].value, 'a')
    Assert.IsEqual(R[1].type, ValueErrorType.Number)
    Assert.IsEqual(R[1].path, '/y')
    Assert.IsEqual(R[1].value, 'b')
  })
})

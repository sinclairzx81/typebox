import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/TupleLength', () => {
  // ----------------------------------------------
  // Tuple: Empty
  // ----------------------------------------------
  const T1 = Type.Tuple([])
  it('Should pass 0', () => {
    const R = Resolve(T1, [])
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T1, [1])
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.TupleLength)
  })
  // ----------------------------------------------
  // Tuple: One
  // ----------------------------------------------
  const T2 = Type.Tuple([Type.Number()])
  it('Should pass 2', () => {
    const R = Resolve(T2, [1])
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 3', () => {
    const R = Resolve(T2, [])
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.TupleLength)
  })
  it('Should pass 4', () => {
    const R = Resolve(T2, [1, 1])
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.TupleLength)
  })
  // ----------------------------------------------
  // Tuple: Element
  // ----------------------------------------------
  const T3 = Type.Tuple([Type.Number(), Type.Number()])
  it('Should pass 5', () => {
    const R = Resolve(T3, [1, 1])
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 6', () => {
    const R = Resolve(T3, ['a', 'b'])
    Assert.IsEqual(R.length, 2)
    Assert.IsEqual(R[0].type, ValueErrorType.Number)
    Assert.IsEqual(R[0].path, '/0')
    Assert.IsEqual(R[0].value, 'a')
    Assert.IsEqual(R[1].type, ValueErrorType.Number)
    Assert.IsEqual(R[1].path, '/1')
    Assert.IsEqual(R[1].value, 'b')
  })
})

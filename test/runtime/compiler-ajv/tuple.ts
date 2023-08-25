import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Tuple', () => {
  it('Should validate tuple of [string, number]', () => {
    const A = Type.String()
    const B = Type.Number()
    const T = Type.Tuple([A, B])
    Ok(T, ['hello', 42])
  })
  it('Should not validate tuple of [string, number] when reversed', () => {
    const A = Type.String()
    const B = Type.Number()
    const T = Type.Tuple([A, B])
    Fail(T, [42, 'hello'])
  })
  it('Should validate with empty tuple', () => {
    const T = Type.Tuple([])
    Ok(T, [])
  })
  it('Should not validate with empty tuple with more items', () => {
    const T = Type.Tuple([])
    Fail(T, [1])
  })
  it('Should not validate with empty tuple with less items', () => {
    const T = Type.Tuple([Type.Number(), Type.Number()])
    Fail(T, [1])
  })
  it('Should validate tuple of objects', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Tuple([A, B])
    Ok(T, [{ a: 'hello' }, { b: 42 }])
  })
  it('Should not validate tuple of objects when reversed', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Tuple([A, B])
    Fail(T, [{ b: 42 }, { a: 'hello' }])
  })
  it('Should not validate tuple when array is less than tuple length', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Tuple([A, B])
    Fail(T, [{ a: 'hello' }])
  })
  it('Should not validate tuple when array is greater than tuple length', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Tuple([A, B])
    Fail(T, [{ a: 'hello' }, { b: 42 }, { b: 42 }])
  })
})

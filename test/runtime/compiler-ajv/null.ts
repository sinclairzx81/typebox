import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Null', () => {
  it('Should not validate number', () => {
    const T = Type.Null()
    Fail(T, 1)
  })
  it('Should not validate string', () => {
    const T = Type.Null()
    Fail(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.Null()
    Fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.Null()
    Fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.Null()
    Fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.Null()
    Ok(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.Null()
    Fail(T, undefined)
  })
})

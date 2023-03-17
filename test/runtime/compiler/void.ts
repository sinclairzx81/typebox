import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/compiler/Void', () => {
  it('Should not validate number', () => {
    const T = Type.Void()
    Fail(T, 1)
  })
  it('Should not validate string', () => {
    const T = Type.Void()
    Fail(T, 'hello')
  })
  it('Should not validate boolean', () => {
    const T = Type.Void()
    Fail(T, true)
  })
  it('Should not validate array', () => {
    const T = Type.Void()
    Fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.Void()
    Fail(T, { a: 1, b: 2 })
  })
  it('Should validate null', () => {
    const T = Type.Void()
    Fail(T, null)
  })
  it('Should validate undefined', () => {
    const T = Type.Void()
    Ok(T, undefined)
  })
  it('Should validate void 0', () => {
    const T = Type.Void()
    Ok(T, void 0)
  })
})

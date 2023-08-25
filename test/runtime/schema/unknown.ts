import { Type } from '@sinclair/typebox'
import { Ok } from './validate'

describe('compiler-ajv/Unknown', () => {
  it('Should validate number', () => {
    const T = Type.Any()
    Ok(T, 1)
  })
  it('Should validate string', () => {
    const T = Type.Any()
    Ok(T, 'hello')
  })
  it('Should validate boolean', () => {
    const T = Type.Any()
    Ok(T, true)
  })
  it('Should validate array', () => {
    const T = Type.Any()
    Ok(T, [1, 2, 3])
  })
  it('Should validate object', () => {
    const T = Type.Any()
    Ok(T, { a: 1, b: 2 })
  })
  it('Should validate null', () => {
    const T = Type.Any()
    Ok(T, null)
  })
  it('Should validate undefined', () => {
    const T = Type.Any()
    Ok(T, undefined)
  })
})

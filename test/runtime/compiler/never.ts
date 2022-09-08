import { Type } from '@sinclair/typebox'
import { fail } from './validate'

describe('type/compiler/Never', () => {
  it('Should not validate number', () => {
    const T = Type.Never()
    fail(T, 1)
  })

  it('Should not validate string', () => {
    const T = Type.Never()
    fail(T, 'hello')
  })

  it('Should not validate boolean', () => {
    const T = Type.Never()
    fail(T, true)
  })

  it('Should not validate array', () => {
    const T = Type.Never()
    fail(T, [1, 2, 3])
  })
  it('Should not validate object', () => {
    const T = Type.Never()
    fail(T, { a: 1, b: 2 })
  })
  it('Should not validate null', () => {
    const T = Type.Never()
    fail(T, null)
  })
  it('Should not validate undefined', () => {
    const T = Type.Never()
    fail(T, undefined)
  })
})

import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler/Function', () => {
  it('Should validate function 1', () => {
    const T = Type.Function([Type.Number()], Type.Number())
    Ok(T, function () {})
  })
  it('Should validate function 2', () => {
    const T = Type.Function([Type.Number()], Type.Number())
    // note: validation only checks typeof 'function'
    Ok(T, function (a: string, b: string, c: string, d: string) {})
  })
  it('Should validate function 3', () => {
    const T = Type.Function([Type.Number()], Type.Number())
    // note: validation only checks typeof 'function'
    Ok(T, function () {
      return 'not-a-number'
    })
  })
  it('Should not validate function', () => {
    const T = Type.Function([Type.Number()], Type.Number())
    Fail(T, 1)
  })
})

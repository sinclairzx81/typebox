import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler/Iterator', () => {
  it('Should validate a iterator 1', () => {
    function* f() {}
    const T = Type.Iterator(Type.Any())
    Ok(T, f())
  })
  it('Should validate a iterator 2', () => {
    const T = Type.Iterator(Type.Any())
    Ok(T, {
      [Symbol.iterator]: () => {},
    })
  })
  it('Should not validate a iterator', () => {
    const T = Type.Iterator(Type.Any())
    Fail(T, {})
  })
})

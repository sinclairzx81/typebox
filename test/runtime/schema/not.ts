import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/schema/Not', () => {
  it('Should validate with not number', () => {
    const T = Type.Not(Type.Number(), Type.String())
    Fail(T, 1)
    Ok(T, 'A')
  })
  it('Should validate with union left', () => {
    // prettier-ignore
    const T = Type.Not(Type.Union([
      Type.Literal('A'), 
      Type.Literal('B'), 
      Type.Literal('C')
    ]), Type.String())
    Fail(T, 'A')
    Fail(T, 'B')
    Fail(T, 'C')
    Ok(T, 'D')
  })
  it('Should validate with union right', () => {
    // prettier-ignore
    const T = Type.Not(Type.Number(), Type.Union([
      Type.String(),
      Type.Boolean()
    ]))
    Fail(T, 1)
    Ok(T, 'A')
    Ok(T, true)
  })
  it('Should not validate with symmetric left right', () => {
    // prettier-ignore
    const T = Type.Not(Type.Number(), Type.Number())
    Fail(T, 1)
    Fail(T, true) // not a number, but not a number either?
  })
})

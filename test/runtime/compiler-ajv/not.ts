import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Not', () => {
  it('Should validate not number', () => {
    const T = Type.Not(Type.Number())
    Fail(T, 1)
    Ok(T, '1')
  })
  it('Should validate not not number', () => {
    const T = Type.Not(Type.Not(Type.Number()))
    Ok(T, 1)
    Fail(T, '1')
  })
  it('Should validate not union', () => {
    // prettier-ignore
    const T = Type.Not(Type.Union([
      Type.Literal('A'), 
      Type.Literal('B'), 
      Type.Literal('C')
    ]))
    Fail(T, 'A')
    Fail(T, 'B')
    Fail(T, 'C')
    Ok(T, 'D')
  })
  it('Should validate not object intersection', () => {
    const T = Type.Intersect([
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
      Type.Object({
        x: Type.Not(Type.Literal(0)),
        y: Type.Not(Type.Literal(0)),
        z: Type.Not(Type.Literal(0)),
      }),
    ])
    Fail(T, { x: 0, y: 0, z: 0 })
    Fail(T, { x: 1, y: 0, z: 0 })
    Fail(T, { x: 1, y: 1, z: 0 })
    Ok(T, { x: 1, y: 1, z: 1 })
  })
})

import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/KeyOf', () => {
  it('Should validate with all object keys as a kind of union', () => {
    const T = Type.KeyOf(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    Ok(T, 'x')
    Ok(T, 'y')
    Ok(T, 'z')
    Fail(T, 'w')
  })
  it('Should validate when using pick', () => {
    const T = Type.KeyOf(
      Type.Pick(
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
          z: Type.Number(),
        }),
        ['x', 'y'],
      ),
    )
    Ok(T, 'x')
    Ok(T, 'y')
    Fail(T, 'z')
  })
  it('Should validate when using omit', () => {
    const T = Type.KeyOf(
      Type.Omit(
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
          z: Type.Number(),
        }),
        ['x', 'y'],
      ),
    )
    Fail(T, 'x')
    Fail(T, 'y')
    Ok(T, 'z')
  })
})

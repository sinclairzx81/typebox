import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.KeyOf')

Test('Should validate with all object keys as a kind of union', () => {
  const T = Type.KeyOf(
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    })
  )
  Ok(T, 'x')
  Ok(T, 'y')
  Ok(T, 'z')
  Fail(T, 'w')
})
Test('Should validate when using pick', () => {
  const T = Type.KeyOf(
    Type.Pick(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number()
      }),
      ['x', 'y']
    )
  )
  Ok(T, 'x')
  Ok(T, 'y')
  Fail(T, 'z')
})
Test('Should validate when using omit', () => {
  const T = Type.KeyOf(
    Type.Omit(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number()
      }),
      ['x', 'y']
    )
  )
  Fail(T, 'x')
  Fail(T, 'y')
  Ok(T, 'z')
})

import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Omit')

Test('Should omit properties on the source schema', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Omit(A, ['z'])
  Ok(T, { x: 1, y: 1 })
})
Test('Should remove required properties on the target schema', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Omit(A, ['z'])
  Assert.IsEqual(T.required.includes('z' as never), false)
})
Test('Should not inherit options from the source object', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Omit(A, ['z'])
  Assert.HasPropertyKey(A, 'additionalProperties')
  Assert.IsEqual(A.additionalProperties, false)
  Assert.NotHasPropertyKey(T, 'additionalProperties')
})
Test('Should omit with keyof object', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const B = Type.Object({
    x: Type.Number(),
    y: Type.Number()
  })
  const T = Type.Omit(A, Type.KeyOf(B), { additionalProperties: false })
  Ok(T, { z: 0 })
  Fail(T, { x: 0, y: 0, z: 0 })
})
Test('Should support Omit of Literal', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T = Type.Omit(A, Type.Literal('x'), {
    additionalProperties: false
  })
  Ok(T, { y: 1, z: 1 })
  Fail(T, { x: 1, y: 1, z: 1 })
})
Test('Should support Omit of Never', () => {
  const A = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    },
    { additionalProperties: false }
  )
  const T = Type.Omit(A, Type.Never())
  Fail(T, { y: 1, z: 1 })
  Ok(T, { x: 1, y: 1, z: 1 })
})

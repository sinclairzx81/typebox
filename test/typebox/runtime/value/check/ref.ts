import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Ref')

// ----------------------------------------------------------------
// Deprecated
// ----------------------------------------------------------------
Test('Should validate for Ref(Schema)', () => {
  const T = Type.Number({ $id: 'T' })
  const R = Type.Ref('T')
  Ok({ T }, R, 1234)
  Fail({ T }, R, 'hello')
})
// ----------------------------------------------------------------
// Standard
// ----------------------------------------------------------------
Test('Should should validate when referencing a type', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const R = Type.Ref('T')
  Ok({ T }, R, {
    x: 1,
    y: 2,
    z: 3
  })
})
Test('Should not validate when passing invalid data', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    }
  )
  const R = Type.Ref('T')
  Fail({ T }, R, {
    x: 1,
    y: 2
  })
})
Test('Should de-reference object property schema', () => {
  const T = Type.Object({
    name: Type.String()
  })
  const R = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number(),
    r: Type.Optional(Type.Ref('T'))
  })
  Ok({ T }, R, { x: 1, y: 2, z: 3 })
  Ok({ T }, R, { x: 1, y: 2, z: 3, r: { name: 'hello' } })
  Fail({ T }, R, { x: 1, y: 2, z: 3, r: { name: 1 } })
  Fail({ T }, R, { x: 1, y: 2, z: 3, r: {} })
})

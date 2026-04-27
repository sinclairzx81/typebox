import { Type } from 'typebox'
import { Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Context')

Test('Should validate with Context', () => {
  const A = Type.String() // <---
  const B = Type.Ref('A')
  const C = Type.Ref('B')
  const D = Type.Ref('C')
  const E = Type.Ref('D')
  Ok({ A, B, C, D }, E, 'hello')
})

import { Value } from 'typebox/value'
import * as Type from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Ref')

Test('Should Create 1', () => {
  const R = Type.Ref('T')
  Assert.Throws(() => Value.Create(R))
})

Test('Should Create 2', () => {
  const R = Type.Ref('T', { default: 'override' })
  Assert.IsEqual(Value.Create(R), 'override') // terminated at R default value
})

Test('Should Create 3', () => {
  const R = Type.Number()
  const T = Type.Object({ x: Type.Ref('R') })
  Assert.IsEqual(Value.Create({ R }, T), { x: 0 })
})

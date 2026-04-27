import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.DefaultFunction')

Test('Should call default as Function', () => {
  const T = Type.Any({ default: () => 1 })
  const R = Value.Default(T, 1)
  Assert.IsEqual(R, 1)
})

import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Ref')

Test('Should Default 1', () => {
  const A = Type.String({})
  const T = Type.Ref('A', { default: 1 })
  const R = Value.Default({ A }, T, undefined)
  Assert.IsEqual(R, 1) // change
})
Test('Should Default 2', () => {
  const A = Type.String()
  const T = Type.Ref('A', { default: 1 })
  const R = Value.Default({ A }, T, null)
  Assert.IsEqual(R, null)
})
// ----------------------------------------------------------------
// Foreign
// ----------------------------------------------------------------
Test('Should Default 3', () => {
  const A = Type.String({ default: 1 })
  const T = Type.Ref('A')
  const R = Value.Default({ A }, T, undefined)
  Assert.IsEqual(R, 1)
})
Test('Should Default 4', () => {
  const A = Type.String({ default: 1 })
  const T = Type.Ref('A')
  const R = Value.Default({ A }, T, null)
  Assert.IsEqual(R, null)
})
// ----------------------------------------------------------------
// Non-Resolvable
// ----------------------------------------------------------------
Test('Should Default 5', () => {
  const T = Type.Ref('A')
  const R = Value.Default(T, 1)
  Assert.IsEqual(R, 1)
})
Test('Should Default 6', () => {
  const T = Type.Ref('A')
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, undefined)
})
Test('Should Default 5', () => {
  const T = Type.Ref('A')
  const R = Value.Default({}, T, 1)
  Assert.IsEqual(R, 1)
})
Test('Should Default 6', () => {
  const T = Type.Ref('A')
  const R = Value.Default({}, T, undefined)
  Assert.IsEqual(R, undefined)
})

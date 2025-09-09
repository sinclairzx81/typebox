import { Type } from 'typebox'
import Value from 'typebox/value'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Arguments')

Test('Should Validate Arguments 1', () => {
  const T = Type.String()
  const R = Value.Check({ T }, Type.Ref('T'), 'hello')
  Assert.IsTrue(R)
})
Test('Should Validate Arguments 2', () => {
  const T = Type.String()
  const R = Value.Check({ T }, Type.Ref('T'), 1234)
  Assert.IsFalse(R)
})
Test('Should Validate Arguments 3', () => {
  const R = Value.Check(Type.String(), 'hello')
  Assert.IsTrue(R)
})
Test('Should Validate Arguments 4', () => {
  const R = Value.Check(Type.String(), 1234)
  Assert.IsFalse(R)
})

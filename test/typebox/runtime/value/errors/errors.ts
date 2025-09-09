import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'
import { TypeBoxError } from 'npm:@sinclair/typebox'

const Test = Assert.Context('Value.Errors')

Test('Should Errors 1', () => {
  const R = Value.Errors(Type.String(), 1)
  Assert.IsTrue(R.length > 0)
})
Test('Should Errors 2', () => {
  const T = Type.String()
  const R = Value.Errors({ T }, Type.Ref('T'), 1)
  Assert.IsTrue(R.length > 0)
})

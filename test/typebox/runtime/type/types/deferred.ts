import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Deferred')

Test('Should Create Deferred 1', () => {
  const T = Type.Deferred('Test', [Type.String(), Type.Number()], { x: 1 })
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.type, 'deferred')
  Assert.IsTrue(Type.IsString(T.parameters[0]))
  Assert.IsTrue(Type.IsNumber(T.parameters[1]))
  Assert.IsEqual(T.options, { x: 1 })
})

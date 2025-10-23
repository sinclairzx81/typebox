import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Identifier')

Test('Should not guard Identifier', () => {
  const T: Type.TIdentifier<'A'> = Type.Identifier('A')
  Assert.IsTrue(Type.IsIdentifier(T))
})
Test('Should Create Identifier 1', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsIdentifier(T))
})

import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Iterator')

Test('Should Repair 1', () => {
  const T = Type.Iterator(Type.Any())
  Assert.Throws(() => Value.Repair(T, 'hello'))
})

import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Promise')

Test('Should Repair 1', () => {
  const T = Type.Promise(Type.Any())
  Assert.Throws(() => Value.Repair(T, 'hello'))
})

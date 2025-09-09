import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Function')

Test('Should Repair 1', () => {
  const T = Type.Function([], Type.Null())
  Assert.Throws(() => Value.Repair(T, 'hello'))
})

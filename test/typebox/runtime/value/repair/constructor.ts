import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Constructor')

Test('Should Repair 1', () => {
  const T = Type.Constructor([], Type.Null())
  Assert.Throws(() => Value.Repair(T, 'hello'))
})

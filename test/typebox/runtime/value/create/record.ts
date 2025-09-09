import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Record')

Test('Should Create 1', () => {
  const T = Type.Record(Type.String(), Type.Object({}))
  Assert.IsEqual(Value.Create(T), {})
})
Test('Should Create 2', () => {
  const T = Type.Record(Type.String(), Type.Object({}), {
    default: {
      x: {}
    }
  })
  Assert.IsEqual(Value.Create(T), { x: {} })
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Create 3', () => {
  const T = Type.Record(Type.String(), Type.Null(), {
    minProperties: 10
  })
  Assert.Throws(() => Value.Create(T))
})

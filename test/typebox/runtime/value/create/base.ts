import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Base')

Test('Should Create 1', () => {
  const X = new class extends Type.Base {}()
  Assert.Throws(() => Value.Create(X))
})
Test('Should Create 2', () => {
  const T = new class extends Type.Base<unknown> {
    public override Create(): unknown {
      return 12345
    }
  }()
  Assert.IsEqual(Value.Create(T), 12345)
})
Test('Should Create 3', () => {
  const X = new class extends Type.Base {
    default = 12345
  }()
  Assert.IsEqual(Value.Create(X), 12345)
})

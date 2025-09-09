import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Base')

Test('Should Clean 1', () => {
  const X = new class extends Type.Base {
    public override Clean(value: unknown): unknown {
      delete (value as any)['x']
      return value
    }
  }()
  const R = Value.Clean(X, { x: 1, y: 1 })
  Assert.IsEqual(R, { y: 1 })
})
Test('Should Clean 2', () => {
  const X = new class extends Type.Base {
    public override Clean(value: unknown): unknown {
      delete (value as any)['x']
      return value
    }
  }()
  const T = Type.Object({
    value: X
  })
  const R = Value.Clean(T, { value: { x: 1, y: 1 } })
  Assert.IsEqual(R, { value: { y: 1 } })
})

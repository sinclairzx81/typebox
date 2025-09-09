import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Base')

// ------------------------------------------------------------------
// Direct
// ------------------------------------------------------------------
Test('Should Convert 1', () => {
  const T = new class extends Type.Base<string | number> {
    public override Convert(value: string | number): string | number {
      return value.toString()
    }
  }()
  Assert.IsEqual(Value.Convert(T, 12345), '12345')
})
Test('Should Convert 2', () => {
  const T = new class extends Type.Base {}()
  Assert.IsEqual(Value.Convert(T, 12345), 12345)
})
// ------------------------------------------------------------------
// Embedded
// ------------------------------------------------------------------
Test('Should Convert 3', () => {
  const T = Type.Object({
    x: new class extends Type.Base<string | number> {
      public override Convert(value: string | number): string | number {
        return value.toString()
      }
    }()
  })
  Assert.IsEqual(Value.Convert(T, { x: 12345 }), { x: '12345' })
})
Test('Should Convert 4', () => {
  const T = Type.Object({ x: new class extends Type.Base {}() })
  Assert.IsEqual(Value.Convert(T, { x: 12345 }), { x: 12345 })
})

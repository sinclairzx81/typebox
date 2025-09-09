import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Base')

class WithDefault extends Type.Base<unknown> {
  public override Check(value: unknown): value is unknown {
    throw new Error('Method not implemented.')
  }
  public override Errors(value: unknown): object[] {
    throw new Error('Method not implemented.')
  }
  public override Default(): unknown {
    return 12345
  }
}
class WithoutDefault extends Type.Base<unknown> {
  public override Check(value: unknown): value is unknown {
    throw new Error('Method not implemented.')
  }
  public override Errors(value: unknown): object[] {
    throw new Error('Method not implemented.')
  }
}
// ------------------------------------------------------------------
// Direct
// ------------------------------------------------------------------
Test('Should Default 1', () => {
  const T = new WithDefault()
  Assert.IsEqual(Value.Default(T, null), 12345)
})
Test('Should Default 2', () => {
  const T = new WithoutDefault()
  Assert.IsEqual(Value.Default(T, null), null)
})
// ------------------------------------------------------------------
// Embedded
// ------------------------------------------------------------------
Test('Should Default 3', () => {
  const T = Type.Object({ x: new WithDefault() })
  Assert.IsEqual(Value.Default(T, { x: null }), { x: 12345 })
})
Test('Should Default 4', () => {
  const T = Type.Object({ x: new WithoutDefault() })
  Assert.IsEqual(Value.Default(T, { x: null }), { x: null })
})

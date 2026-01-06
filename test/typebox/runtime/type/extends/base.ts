import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Base')

export class TBase extends Type.Base<unknown> {
  public override Check(value: unknown): value is unknown {
    throw new Error('Method not implemented.')
  }
  public override Errors(value: unknown): object[] {
    throw new Error('Method not implemented.')
  }
}

const Base = new TBase()
// ------------------------------------------------------------------
// Identity: Base types extend each other if they are instances
// of the same class (constructor check). This models TypeScript's
// structural type checking at runtime.
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  const R: ExtendsResult.TExtendsTrue<{}> = Extends({}, Base, Base)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<object, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Base, Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, object>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<any, object>(false)
  Assert.IsExtends<any, object>(true)
  const R = Extends({}, Type.Any(), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtendsWhenLeftIsNever<never, object>(true)
  const R = Extends({}, Type.Never(), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 3', () => {
  Assert.IsExtends<unknown, object>(false)
  const R = Extends({}, Type.Unknown(), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})

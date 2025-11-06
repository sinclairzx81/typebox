import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Base')

// ------------------------------------------------------------------
// BaseInstance
// ------------------------------------------------------------------
Test('Should Base 1', () => {
  const T: TStringBase = new Type.Base()
  Assert.IsTrue(T.Check(null))
})
Test('Should Base 2', () => {
  const T: TStringBase = new Type.Base()
  Assert.IsEqual(T.Errors(null), [])
})
Test('Should Base 3', () => {
  const T: TStringBase = new Type.Base()
  Assert.IsEqual(T.Clean(null), null)
})
// ------------------------------------------------------------------
// DerivedInstance
// ------------------------------------------------------------------
class TStringBase extends Type.Base<string> {
  public override Check(value: unknown): value is string {
    return typeof value === 'string'
  }
  public override Errors(value: unknown): object[] {
    return typeof value === 'string' ? [] : [{ message: 'expected string' }]
  }
}
const StringBase = () => new TStringBase()
Test('Should Base 3', () => {
  const T: TStringBase = StringBase()
  Assert.IsFalse(Type.IsAny(T))
})
Test('Should Base 4', () => {
  const T: TStringBase = StringBase()
  Assert.IsTrue(Type.IsBase(T))
})
Test('Should Base 5', () => {
  const T: TStringBase = StringBase()
  Assert.IsTrue(T.Check('hello'))
})
Test('Should Base 6', () => {
  const T: TStringBase = StringBase()
  Assert.IsEqual(T.Errors('hello'), [])
})
Test('Should Base 7', () => {
  const T: TStringBase = StringBase()
  Assert.IsFalse(T.Check(1))
})
Test('Should Base 8', () => {
  const T: TStringBase = StringBase()
  Assert.IsEqual(T.Errors(1), [{ message: 'expected string' }])
})
// ------------------------------------------------------------------
// Clone - Compositor
// ------------------------------------------------------------------
Test('Should Base 9', () => {
  class Foo extends Type.Base {
    public override Clone(): Type.Base {
      return new Foo()
    }
  }
  const T = new Foo()
  // Non-Action
  const A = Type.Object({ value: T })
  Assert.IsFalse(Type.IsOptional(T))
  Assert.IsFalse(Type.IsOptional(A.properties.value))
  // Action
  const B = Type.Partial(A)
  Assert.IsFalse(Type.IsOptional(T))
  Assert.IsFalse(Type.IsOptional(A.properties.value))
  Assert.IsTrue(Type.IsOptional(B.properties.value))
})
Test('Should Base 10', () => {
  class Foo extends Type.Base {}
  const T = new Foo()
  const A = Type.Object({ value: T })
  Assert.IsFalse(Type.IsOptional(T))
  Assert.IsFalse(Type.IsOptional(A.properties.value))
  Assert.Throws(() => Type.Partial(A)) // action require Clone
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1444
// ------------------------------------------------------------------
Test('Should Base 11', () => {
  class TDateType extends Type.Base<Date> {
    public override Clone(): TDateType {
      return new TDateType()
    }
  }
  const DateType = () => new TDateType()
  const A = Type.Object({
    status: Type.String(),
    updatedDate: DateType(),
    createdDate: DateType()
  })
  const B = Type.Evaluate(Type.Intersect([A, Type.Object({ count: Type.Number() })]))
  const C = Type.Object({ freeSchema: Type.Partial(B) })
  const D = Type.Evaluate(Type.Intersect([A, Type.Object({ count: Type.Number() })]))
  // A
  Assert.IsFalse(Type.IsOptional(A.properties.status))
  Assert.IsFalse(Type.IsOptional(A.properties.updatedDate))
  Assert.IsFalse(Type.IsOptional(A.properties.createdDate))
  // B
  Assert.IsFalse(Type.IsOptional(B.properties.status))
  Assert.IsFalse(Type.IsOptional(B.properties.updatedDate))
  Assert.IsFalse(Type.IsOptional(B.properties.createdDate))
  Assert.IsFalse(Type.IsOptional(B.properties.count))
  // C
  Assert.IsTrue(Type.IsOptional(C.properties.freeSchema.properties.status))
  Assert.IsTrue(Type.IsOptional(C.properties.freeSchema.properties.updatedDate))
  Assert.IsTrue(Type.IsOptional(C.properties.freeSchema.properties.createdDate))
  Assert.IsTrue(Type.IsOptional(C.properties.freeSchema.properties.count))
  // D
  Assert.IsFalse(Type.IsOptional(D.properties.status))
  Assert.IsFalse(Type.IsOptional(D.properties.updatedDate))
  Assert.IsFalse(Type.IsOptional(D.properties.createdDate))
  Assert.IsFalse(Type.IsOptional(D.properties.count))
})

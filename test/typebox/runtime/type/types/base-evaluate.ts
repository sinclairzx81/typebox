import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Base.Evaluate')

// ------------------------------------------------------------------
// Base Type Intersection with Evaluate
// ------------------------------------------------------------------
class TId extends Type.Base<string> {
  public override Check(value: unknown): value is string {
    return typeof value === 'string'
  }
  public override Clone(): TId {
    return new TId()
  }
}

Test('Should evaluate intersect of same Base class instances as equal 1', () => {
  const schemaNonEvaluated = Type.Intersect([
    new TId(),
    new TId(),
  ])
  const schemaEvaluated = Type.Evaluate(schemaNonEvaluated)
  
  // Should not be never
  Assert.IsFalse(Type.IsNever(schemaEvaluated))
  // Should be TId (Base type)
  Assert.IsTrue(Type.IsBase(schemaEvaluated))
})

Test('Should evaluate intersect of same Base class instances as equal 2', () => {
  const T1 = new TId()
  const T2 = new TId()
  const schemaNonEvaluated = Type.Intersect([T1, T2])
  const schemaEvaluated = Type.Evaluate(schemaNonEvaluated)
  
  // Should not be never
  Assert.IsFalse(Type.IsNever(schemaEvaluated))
  // Should be TId (Base type)
  Assert.IsTrue(Type.IsBase(schemaEvaluated))
  // Should be instance of TId
  Assert.IsTrue(schemaEvaluated instanceof TId)
})

Test('Should evaluate intersect of different Base class instances as never', () => {
  class TId2 extends Type.Base<number> {
    public override Check(value: unknown): value is number {
      return typeof value === 'number'
    }
    public override Clone(): TId2 {
      return new TId2()
    }
  }
  
  const schemaNonEvaluated = Type.Intersect([
    new TId(),
    new TId2(),
  ])
  const schemaEvaluated = Type.Evaluate(schemaNonEvaluated)
  
  // Should be never
  Assert.IsTrue(Type.IsNever(schemaEvaluated))
})

Test('Should evaluate single Base type in intersect', () => {
  const schemaNonEvaluated = Type.Intersect([
    new TId(),
  ])
  const schemaEvaluated = Type.Evaluate(schemaNonEvaluated)
  
  // Should not be never
  Assert.IsFalse(Type.IsNever(schemaEvaluated))
  // Should be TId (Base type)
  Assert.IsTrue(Type.IsBase(schemaEvaluated))
  // Should be instance of TId
  Assert.IsTrue(schemaEvaluated instanceof TId)
})

Test('Should evaluate intersect of Base type with Object', () => {
  const schemaNonEvaluated = Type.Intersect([
    new TId(),
    Type.Object({ foo: Type.String() }),
  ])
  const schemaEvaluated = Type.Evaluate(schemaNonEvaluated)
  
  // Should be an object with foo property
  Assert.IsTrue(Type.IsObject(schemaEvaluated))
  Assert.IsTrue('foo' in schemaEvaluated.properties)
  Assert.IsTrue(Type.IsString(schemaEvaluated.properties.foo))
})

Test('Should evaluate triple intersect of same Base class instances', () => {
  const schemaNonEvaluated = Type.Intersect([
    new TId(),
    new TId(),
    new TId(),
  ])
  const schemaEvaluated = Type.Evaluate(schemaNonEvaluated)
  
  // Should not be never
  Assert.IsFalse(Type.IsNever(schemaEvaluated))
  // Should be TId (Base type)
  Assert.IsTrue(Type.IsBase(schemaEvaluated))
  // Should be instance of TId
  Assert.IsTrue(schemaEvaluated instanceof TId)
})

// Type-level check (from the original issue)
Test('Should preserve type-level types correctly', () => {
  const schemaNonEvaluated = Type.Intersect([
    new TId(),
    new TId(),
  ])
  type TNonEvaluated = Type.StaticDecode<typeof schemaNonEvaluated>
  
  const schemaEvaluated = Type.Evaluate(schemaNonEvaluated)
  type TEvaluated = Type.StaticDecode<typeof schemaEvaluated>
  
  // Runtime checks
  Assert.IsFalse(Type.IsNever(schemaEvaluated))
  Assert.IsTrue(Type.IsBase(schemaEvaluated))
  
  // Type-level assertions (compile-time checks)
  const _nonEval: TNonEvaluated = 'test' // should be string
  const _eval: TEvaluated = 'test' // should be string, not never
  
  Assert.IsTrue(true) // If compiles, test passes
})

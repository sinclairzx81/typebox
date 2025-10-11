import { Assert } from 'test'
import Guard from 'typebox/guard'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.CollapseToObject')

// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
Test('Should CollapseToObject 1', () => {
  const A: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.CollapseToObject(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
})
Test('Should CollapseToObject 2', () => {
  const A: Type.TObject<{
    x: Type.TNever
  }> = Type.CollapseToObject(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.String() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNever(A.properties.x))
  Assert.IsEqual(Guard.Keys(A.properties).length, 1)
})
Test('Should CollapseToObject 3', () => {
  const A: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.CollapseToObject(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Literal(1) })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsLiteral(A.properties.x))
  Assert.IsEqual(A.properties.x.const, 1)
  Assert.IsEqual(Guard.Keys(A.properties).length, 1)
})
Test('Should CollapseToObject 4', () => {
  const A: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.CollapseToObject(Type.Intersect([
    Type.Object({ x: Type.Literal(1) }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsLiteral(A.properties.x))
  Assert.IsEqual(A.properties.x.const, 1)
  Assert.IsEqual(Guard.Keys(A.properties).length, 1)
})
Test('Should CollapseToObject 5', () => {
  const A: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.CollapseToObject(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Literal(1) }),
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsLiteral(A.properties.x))
  Assert.IsEqual(A.properties.x.const, 1)
  Assert.IsEqual(Guard.Keys(A.properties).length, 1)
})
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
Test('Should CollapseToObject 6', () => {
  const A: Type.TObject<{}> = Type.CollapseToObject(Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(Guard.Keys(A.properties).length, 0)
})
Test('Should CollapseToObject 7', () => {
  const A: Type.TObject<{
    x: Type.TUnion<[Type.TNumber, Type.TString]>
  }> = Type.CollapseToObject(Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.String() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsUnion(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.x.anyOf[0]))
  Assert.IsTrue(Type.IsString(A.properties.x.anyOf[1]))
})
Test('Should CollapseToObject 8', () => {
  const A: Type.TObject<{
    x: Type.TNumber
  }> = Type.CollapseToObject(Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
})
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
Test('Should CollapseToObject 9', () => {
  const A: Type.TObject<{}> = Type.CollapseToObject(Type.Tuple([]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(Guard.Keys(A.properties).length, 0)
})
Test('Should CollapseToObject 10', () => {
  const A: Type.TObject<{
    0: Type.TNumber
    1: Type.TString
  }> = Type.CollapseToObject(Type.Tuple([
    Type.Number(),
    Type.String()
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties[0]))
  Assert.IsTrue(Type.IsString(A.properties[1]))
})
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
Test('Should CollapseToObject 11', () => {
  const A: Type.TObject<{
    x: Type.TNumber
  }> = Type.CollapseToObject(Type.Object({
    x: Type.Number()
  }))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
})
// ------------------------------------------------------------------
// Non-Object
// ------------------------------------------------------------------
Test('Should CollapseToObject 12', () => {
  const A: Type.TObject<{}> = Type.CollapseToObject(Type.String())
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(Guard.Keys(A.properties).length, 0)
})

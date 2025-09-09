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
  const A: Type.TObject<{}> = Type.CollapseToObject(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.String() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(Guard.Keys(A.properties).length, 0)
})
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
Test('Should CollapseToObject 3', () => {
  const A: Type.TObject<{}> = Type.CollapseToObject(Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(Guard.Keys(A.properties).length, 0)
})
Test('Should CollapseToObject 4', () => {
  const A: Type.TObject<{
    x: Type.TNever
  }> = Type.CollapseToObject(Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.String() })
  ]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNever(A.properties.x))
})
Test('Should CollapseToObject 5', () => {
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
Test('Should CollapseToObject 6', () => {
  const A: Type.TObject<{}> = Type.CollapseToObject(Type.Tuple([]))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(Guard.Keys(A.properties).length, 0)
})
Test('Should CollapseToObject 7', () => {
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
Test('Should CollapseToObject 8', () => {
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
Test('Should CollapseToObject 9', () => {
  const A: Type.TObject<{}> = Type.CollapseToObject(Type.String())
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(Guard.Keys(A.properties).length, 0)
})

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Composite')

// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
Test('Should Composite 1', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.Number() })
  const R: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties.x))
  Assert.IsTrue(Type.IsNumber(R.properties.y))
})
Test('Should Composite 2', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ x: Type.Number() })
  const R: Type.TObject<{
    x: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties.x))
})
Test('Should Composite 3', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ x: Type.String() })
  const R: Type.TObject<{
    x: Type.TNever
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNever(R.properties.x))
})
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
Test('Should Composite 4', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Type.Tuple([Type.String(), Type.Number()])
  const R: Type.TObject<{
    0: Type.TString
    1: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsString(R.properties[0]))
  Assert.IsTrue(Type.IsNumber(R.properties[1]))
})
Test('Should Composite 5', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Type.Tuple([Type.Number(), Type.String()])
  const R: Type.TObject<{
    0: Type.TNever
    1: Type.TNever
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNever(R.properties[0]))
  Assert.IsTrue(Type.IsNever(R.properties[1]))
})
// ------------------------------------------------------------------
// Non-Composite Rule
// ------------------------------------------------------------------
Test('Should Composite 6', () => {
  const A = Type.String()
  const B = Type.Object({ x: Type.Number() })
  const R: Type.TObject<{
    x: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties.x))
})
Test('Should Composite 7', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.String()
  const R: Type.TObject<{
    x: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties.x))
})
// ------------------------------------------------------------------
// Tuple + Object Mixed Composite
// ------------------------------------------------------------------
Test('Should Composite 8', () => {
  const A = Type.Tuple([Type.String()])
  const B = Type.Object({ x: Type.Number() })
  const R: Type.TObject<{
    0: Type.TString
    x: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsString(R.properties[0]))
  Assert.IsTrue(Type.IsNumber(R.properties.x))
})
Test('Should Composite 9', () => {
  const A = Type.Tuple([Type.Number()])
  const B = Type.Object({ 0: Type.Number() })
  const R: Type.TObject<{
    0: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties[0]))
})
Test('Should Composite 10', () => {
  const A = Type.Tuple([Type.String()])
  const B = Type.Object({ 0: Type.Number() })
  const R: Type.TObject<{
    0: Type.TNever
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNever(R.properties[0]))
})
// ------------------------------------------------------------------
// Object with Modifiers (Readonly and Optional)
// ------------------------------------------------------------------
Test('Should Composite 11', () => {
  const A = Type.Object({ x: Type.Readonly(Type.Number()) })
  const B = Type.Object({ x: Type.Readonly(Type.Number()) })
  const R: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsReadonly(R.properties.x))
  Assert.IsFalse(Type.IsOptional(R.properties.x))
})
Test('Should Composite 12', () => {
  const A = Type.Object({ x: Type.Readonly(Type.Number()) })
  const B = Type.Object({ x: Type.Number() })
  const R: Type.TObject<{
    x: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsFalse(Type.IsReadonly(R.properties.x))
})
Test('Should Composite 13', () => {
  const A = Type.Object({ x: Type.Optional(Type.Number()) })
  const B = Type.Object({ x: Type.Optional(Type.Number()) })
  const R: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsOptional(R.properties.x))
  Assert.IsFalse(Type.IsReadonly(R.properties.x))
})
Test('Should Composite 14', () => {
  const A = Type.Object({ x: Type.Optional(Type.Number()) })
  const B = Type.Object({ x: Type.Number() })
  const R: Type.TObject<{
    x: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsFalse(Type.IsOptional(R.properties.x))
})
Test('Should Composite 15', () => {
  const A = Type.Object({ x: Type.Readonly(Type.Optional(Type.Number())) })
  const B = Type.Object({ x: Type.Readonly(Type.Optional(Type.Number())) })
  const R: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsReadonly(R.properties.x))
  Assert.IsTrue(Type.IsOptional(R.properties.x))
})
Test('Should Composite 16', () => {
  const A = Type.Object({ x: Type.Readonly(Type.Optional(Type.Number())) })
  const B = Type.Object({ y: Type.Number() })
  const R: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TNumber
  }> = Type.Composite(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsReadonly(R.properties.x))
  Assert.IsTrue(Type.IsOptional(R.properties.x))
  Assert.IsFalse(Type.IsReadonly(R.properties.y))
  Assert.IsFalse(Type.IsOptional(R.properties.y))
})

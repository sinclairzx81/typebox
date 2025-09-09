import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Mapped')

// ------------------------------------------------------------------
// Deferred
//
// Mapped can only defer on the Key. The rest of the expression
// is actions.
// ------------------------------------------------------------------
Test('Should Mapped 1', () => {
  const K = Type.Identifier('K')
  const B = Type.Ref('X')
  const C = Type.Ref('K')
  const D = Type.Number()
  const T: Type.TMapped<Type.TIdentifier<'K'>, Type.TRef<'X'>, Type.TRef<'K'>, Type.TNumber> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsDeferred(T))
})
Test('Should Mapped 2', () => {
  const K = Type.Identifier('K')
  const B = Type.Literal('x')
  const C = Type.Ref('K')
  const D = Type.Ref('X')
  const T: Type.TObject<{ x: Type.TRef<'X'> }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Mapped 3', () => {
  const K = Type.Identifier('K')
  const B = Type.Literal('x')
  const C = Type.Ref('K')
  const D = Type.Number()
  const T: Type.TObject<{ x: Type.TNumber }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsEqual(T.required, ['x'])
})
Test('Should Mapped 4', () => {
  const K = Type.Identifier('K')
  const B = Type.Literal('x')
  const C = Type.Uppercase(Type.Ref('K'))
  const D = Type.Number()
  const T: Type.TObject<{ X: Type.TNumber }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.X))
  Assert.IsEqual(T.required, ['X'])
})
Test('Should Mapped 5', () => {
  const K = Type.Identifier('K')
  const B = Type.Literal('x')
  const C = Type.Ref('K')
  const D = Type.Readonly(Type.Number())
  const T: Type.TObject<{ x: Type.TReadonly<Type.TNumber> }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsEqual(T.required, ['x'])
})
Test('Should Mapped 6', () => {
  const K = Type.Identifier('K')
  const B = Type.Literal('x')
  const C = Type.Ref('K')
  const D = Type.Optional(Type.Number())
  const T: Type.TObject<{ x: Type.TOptional<Type.TNumber> }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsEqual(T.required, undefined)
})
Test('Should Mapped 7', () => {
  const K = Type.Identifier('K')
  const B = Type.Literal('x')
  const C = Type.Ref('K')
  const D = Type.Optional(Type.Readonly(Type.Number()))
  const T: Type.TObject<{ x: Type.TReadonly<Type.TOptional<Type.TNumber>> }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsEqual(T.required, undefined)
})
Test('Should Mapped 8', () => {
  const S = Type.Partial(Type.Object({
    x: Type.Number(),
    y: Type.String()
  }))
  const K = Type.Identifier('K')
  const B = Type.KeyOf(S)
  const C = Type.Ref('K')
  const D = Type.OptionalRemoveAction(Type.Index(S, Type.Ref('K')))
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TString
  }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsFalse(Type.IsOptional(T.properties.y))
  Assert.IsEqual(T.required, ['x', 'y'])
})
Test('Should Mapped 9', () => {
  const S = Type.Object({
    x: Type.Readonly(Type.Number()),
    y: Type.Readonly(Type.String())
  })
  const K = Type.Identifier('K')
  const B = Type.KeyOf(S)
  const C = Type.Ref('K')
  const D = Type.ReadonlyRemoveAction(Type.Index(S, Type.Ref('K')))
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TString
  }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsFalse(Type.IsReadonly(T.properties.y))
  Assert.IsEqual(T.required, ['x', 'y'])
})
Test('Should Mapped 10', () => {
  const S = Type.Object({
    x: Type.Number(),
    y: Type.String()
  })
  const K = Type.Identifier('K')
  const B = Type.KeyOf(S)
  const C = Type.Ref('K')
  const D = Type.ReadonlyAddAction(Type.Index(S, Type.Ref('K')))
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
    y: Type.TReadonly<Type.TString>
  }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsTrue(Type.IsReadonly(T.properties.y))
  Assert.IsEqual(T.required, ['x', 'y'])
})
Test('Should Mapped 11', () => {
  const S = Type.Object({
    x: Type.Number(),
    y: Type.String()
  })
  const K = Type.Identifier('K')
  const B = Type.KeyOf(S)
  const C = Type.Ref('K')
  const D = Type.OptionalAddAction(Type.Index(S, Type.Ref('K')))
  const T: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
    y: Type.TOptional<Type.TString>
  }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsTrue(Type.IsOptional(T.properties.y))
  Assert.IsEqual(T.required, undefined)
})
Test('Should Mapped 12', () => {
  const S = Type.Tuple([
    Type.Number(),
    Type.String()
  ])
  const K = Type.Identifier('K')
  const B = Type.KeyOf(S)
  const C = Type.Ref('K')
  const D = Type.Index(S, Type.Ref('K'))
  const T: Type.TObject<{
    0: Type.TNumber
    1: Type.TString
  }> = Type.Mapped(K, B, C, D)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsTrue(Type.IsString(T.properties[1]))
})

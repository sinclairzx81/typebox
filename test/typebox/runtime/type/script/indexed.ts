import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Indexed')

Test('Should Indexed 1', () => {
  const T: Type.TNumber = Type.Script('{ x: number }["x"]')
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Indexed 2', () => {
  const T: Type.TLiteral<1> = Type.Script('[1, 2, 3][0]')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Indexed 3', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<3>]> = Type.Script('[1, 2, 3][0 | 2]')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 3)
})
Test('Should Indexed 4', () => {
  const T: Type.TString = Type.Script('(string[])[number]')
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Indexed 5', () => {
  const T: Type.TArray<Type.TString> = Type.Script('(string[][])[number]')
  Assert.IsTrue(Type.IsArray(T))
  Assert.IsTrue(Type.IsString(T.items))
})
Test('Should Indexed 6', () => {
  const A: Type.TObject<{
    x: Type.TNumber
  }> = Type.Script('{ x: number }')
  const T: Type.TNever = Type.Script({ A }, 'A[string]')
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Indexed 7', () => {
  const A: Type.TObject<{
    x: Type.TNumber
  }> = Type.Script('{ x: number }')
  const T: Type.TNumber = Type.Script({ A }, 'A[keyof A]')
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Indexed 8', () => {
  const A: Type.TObject<{
    x: Type.TNumber
    y: Type.TString
  }> = Type.Script('{ x: number, y: string }')
  // CACHE | TYPESCRIPT TYPE ID ORDER ISSUE
  const T /*: Type.TUnion<[Type.TNumber, Type.TString]> */ = Type.Script({ A }, 'A[keyof A]')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Indexed 9', () => {
  const T: Type.TLiteral<1> = Type.Script('[[1], 2, 3][0][0]')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Indexed 10', () => {
  const R: Type.TIndexDeferred<Type.TRef<'A'>, Type.TLiteral<'x'>> = Type.Script('A["x"]')
  const T: Type.TNumber = Type.Instantiate({ A: Type.Script(`{ x: number }`) }, R)
  Assert.IsTrue(Type.IsNumber(T))
})
// ------------------------------------------------------------------
// Length
// ------------------------------------------------------------------
Test('Should Indexed 11', () => {
  const T = Type.Script(`[1, 2, 3]`)
  const S: Type.TLiteral<3> = Type.Script({ T }, `T['length']`)
  Assert.IsTrue(Type.IsLiteral(S))
  Assert.IsEqual(S.const, 3)
})
Test('Should Indexed 12', () => {
  const T = Type.Script(`string[]`)
  const S: Type.TNumber = Type.Script({ T }, `T['length']`)
  Assert.IsTrue(Type.IsNumber(S))
})
Test('Should Indexed 13', () => {
  const T = Type.Script(`[1, 2, 3]['length']`)
  const S: Type.TLiteral<3> = T
  Assert.IsTrue(Type.IsLiteral(S))
  Assert.IsEqual(S.const, 3)
})
Test('Should Indexed 14', () => {
  const T = Type.Script(`[1, 2, 3][]['length']`)
  const S: Type.TNumber = T
  Assert.IsTrue(Type.IsNumber(S))
})
Test('Should Indexed 15', () => {
  const T = Type.Script(`[1, 2, 3, 4, 5]['length']`)
  const S: Type.TLiteral<5> = T
  Assert.IsTrue(Type.IsLiteral(S))
  Assert.IsEqual(S.const, 5)
})
Test('Should Indexed 16', () => {
  const T = Type.Script(`[1, 2, 3, 4, 5][]['length']`)
  const S: Type.TNumber = T
  Assert.IsTrue(Type.IsNumber(S))
})
Test('Should Indexed 17', () => {
  const T = Type.Script(`string[][][]['length']`)
  const S: Type.TNumber = T
  Assert.IsTrue(Type.IsNumber(S))
})
Test('Should Indexed 18', () => {
  const T = Type.Script(`[1, 2, 3][][number]`)
  const S: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = T
  Assert.IsTrue(Type.IsTuple(S))
  Assert.IsEqual(S.items[0].const, 1)
  Assert.IsEqual(S.items[1].const, 2)
  Assert.IsEqual(S.items[2].const, 3)
})
Test('Should Indexed 19', () => {
  const T = Type.Script(`[1, 2, 3]['length'][]`)
  const S: Type.TArray<Type.TLiteral<3>> = T
  Assert.IsTrue(Type.IsArray(S))
  Assert.IsTrue(Type.IsLiteral(S.items))
  Assert.IsEqual(S.items.const, 3)
})
Test('Should Indexed 20', () => {
  const T = Type.Script(`[1, 2, 3][]['length'][]`)
  const S: Type.TArray<Type.TNumber> = T
  Assert.IsTrue(Type.IsArray(S))
  Assert.IsTrue(Type.IsNumber(S.items))
})
Test('Should Indexed 20', () => {
  const T = Type.Script(`[1, 2, 3][]['length'][]`)
  const S: Type.TArray<Type.TNumber> = T
  Assert.IsTrue(Type.IsArray(S))
  Assert.IsTrue(Type.IsNumber(S.items))
})
// ------------------------------------------------------------------
// Indexed This
// ------------------------------------------------------------------
Test('Should Indexed 21', () => {
  const T = Type.Script(`
    export interface A{ a: 42, self: this }
    export type B = A['self']['a']
  `)
  const B: Type.TLiteral<42> = T.B
  Assert.IsTrue(Type.IsLiteral(B))
  Assert.IsEqual(B.const, 42)
})
Test('Should Indexed 22', () => {
  const T = Type.Script(`
    export interface A{ value: 42, self: this }
    export type B = A['self']['value' | 'self']
  `)
  // const B: Type.TUnion<[
  //   Type.TLiteral<42>,
  //   Type.TObject<{
  //     value: Type.TLiteral<42>
  //     self: Type.TThis
  //   }>
  // ]> = T.B
  const B: Type.TUnion<[
    Type.TObject<{
      value: Type.TLiteral<42>
      self: Type.TThis
    }>,
    Type.TLiteral<42>
  ]> = T.B
  Assert.IsTrue(Type.IsUnion(B))
  Assert.IsTrue(Type.IsLiteral(B.anyOf[0]))
  Assert.IsEqual(B.anyOf[0].const, 42)
  Assert.IsTrue(Type.IsObject(B.anyOf[1]))
  Assert.IsTrue(Type.IsLiteral(B.anyOf[1].properties.value))
  Assert.IsTrue(Type.IsThis(B.anyOf[1].properties.self))
})
Test('Should Indexed 23', () => {
  const T = Type.Script(`
    export interface A { value: 42, self: this }
    export type B = A['self']['self']['value']
  `)
  const B: Type.TLiteral<42> = T.B
  Assert.IsTrue(Type.IsLiteral(B))
  Assert.IsEqual(B.const, 42)
})
Test('Should Indexed 24', () => {
  const T = Type.Script(`
    export interface A { nested: { x: 42 }, self: this }
    export type B = A['self']['nested']
  `)
  const B: Type.TObject<{ x: Type.TLiteral<42> }> = T.B
  Assert.IsTrue(Type.IsObject(B))
  Assert.IsTrue(Type.IsLiteral(B.properties.x))
  Assert.IsEqual(B.properties.x.const, 42)
})
Test('Should Indexed 25', () => {
  const T = Type.Script(`
    export interface A { tag: 'hello', self: this }
    export type B = A['self']['self']['tag']
  `)
  const B: Type.TLiteral<'hello'> = T.B
  Assert.IsTrue(Type.IsLiteral(B))
  Assert.IsEqual(B.const, 'hello')
})
Test('Should Indexed 26', () => {
  const T = Type.Script(`
    export interface A { a: 1, b: 2, self: this }
    export type B = A['self']['self']['a' | 'b']
  `)
  const B: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]> = T.B
  Assert.IsTrue(Type.IsUnion(B))
  Assert.IsTrue(Type.IsLiteral(B.anyOf[0]))
  Assert.IsEqual(B.anyOf[0].const, 1)
  Assert.IsTrue(Type.IsLiteral(B.anyOf[1]))
  Assert.IsEqual(B.anyOf[1].const, 2)
})
Test('Should Indexed 27', () => {
  const T = Type.Script(`
    export interface A { value: 42 | 43, self: this }
    export type B = A['self']['value']
  `)
  const B: Type.TUnion<[Type.TLiteral<42>, Type.TLiteral<43>]> = T.B
  Assert.IsTrue(Type.IsUnion(B))
  Assert.IsTrue(Type.IsLiteral(B.anyOf[0]))
  Assert.IsEqual(B.anyOf[0].const, 42)
  Assert.IsTrue(Type.IsLiteral(B.anyOf[1]))
  Assert.IsEqual(B.anyOf[1].const, 43)
})
Test('Should Indexed 28', () => {
  const T = Type.Script(`
    export interface A { items: number[], self: this }
    export type B = A['self']['items']
  `)
  const B: Type.TArray<Type.TNumber> = T.B
  Assert.IsTrue(Type.IsArray(B))
  Assert.IsTrue(Type.IsNumber(B.items))
})
Test('Should Indexed 29', () => {
  const T = Type.Script(`
    export interface A { value: 1, b: B }
    export interface B { value: 2, self: this }
    export type C = B['self']['value']
  `)
  const C: Type.TLiteral<2> = T.C
  Assert.IsTrue(Type.IsLiteral(C))
  Assert.IsEqual(C.const, 2)
})
Test('Should Indexed 30', () => {
  const T = Type.Script(`
    export interface A { value: 42, self: this }
    export type B = A['self']
  `)
  const B: Type.TObject<{
    value: Type.TLiteral<42>
    self: Type.TThis
  }> = T.B
  Assert.IsTrue(Type.IsObject(B))
  Assert.IsTrue(Type.IsLiteral(B.properties.value))
  Assert.IsEqual(B.properties.value.const, 42)
  Assert.IsTrue(Type.IsThis(B.properties.self))
})
// ------------------------------------------------------------------
// Indexed Expand This
// ------------------------------------------------------------------
Test('Should Indexed 31', () => {
  const T = Type.Script(`
    export interface A { self: this, items: this[] }
    export type B = A['items']
  `)
  const B: Type.TArray<
    Type.TObject<{
      self: Type.TThis
      items: Type.TArray<Type.TThis>
    }>
  > = T.B
  Assert.IsTrue(Type.IsArray(B))
  Assert.IsTrue(Type.IsObject(B.items))
  Assert.IsTrue(Type.IsThis(B.items.properties.self))
})
Test('Should Indexed 32', () => {
  const T = Type.Script(`
    export interface A { self: this, pair: [this, this] }
    export type B = A['pair']
  `)
  const B: Type.TTuple<[
    Type.TObject<{ self: Type.TThis; pair: Type.TTuple<[Type.TThis, Type.TThis]> }>,
    Type.TObject<{ self: Type.TThis; pair: Type.TTuple<[Type.TThis, Type.TThis]> }>
  ]> = T.B
  Assert.IsTrue(Type.IsTuple(B))
  Assert.IsTrue(Type.IsObject(B.items[0]))
  Assert.IsTrue(Type.IsObject(B.items[1]))
  Assert.IsTrue(Type.IsThis(B.items[0].properties.self))
  Assert.IsTrue(Type.IsThis(B.items[1].properties.self))
})
Test('Should Indexed 33', () => {
  const T = Type.Script(`
    export interface A { self: this, value: this | string }
    export type B = A['value']
  `)
  const B: Type.TUnion<[
    Type.TObject<{ self: Type.TThis; value: Type.TUnion<[Type.TThis, Type.TString]> }>,
    Type.TString
  ]> = T.B
  Assert.IsTrue(Type.IsUnion(B))
  Assert.IsTrue(Type.IsObject(B.anyOf[0]))
  Assert.IsTrue(Type.IsThis(B.anyOf[0].properties.self))
  Assert.IsTrue(Type.IsString(B.anyOf[1]))
})
Test('Should Indexed 34', () => {
  const T = Type.Script(`
    export interface A { self: this, value: this & { x: 1 } }
    export type B = A['value']
  `)
  const B: Type.TObject<{
    self: Type.TThis
    value: Type.TIntersect<[
      Type.TThis,
      Type.TObject<{
        x: Type.TLiteral<1>
      }>
    ]>
    x: Type.TLiteral<1>
  }> = T.B
  Assert.IsTrue(Type.IsObject(B))
  Assert.IsTrue(Type.IsThis(B.properties.self))
  Assert.IsTrue(Type.IsIntersect(B.properties.value))
  Assert.IsTrue(Type.IsThis(B.properties.value.allOf[0]))
  Assert.IsTrue(Type.IsObject(B.properties.value.allOf[1]))
  Assert.IsTrue(Type.IsLiteral(B.properties.x))
  Assert.IsEqual(B.properties.x.const, 1)
})
Test('Should Indexed 35', () => {
  const T = Type.Script(`
    export interface A { self: this, value: Promise<this> }
    export type B = A['value']
  `)
  const B: Type.TPromise<
    Type.TObject<{
      self: Type.TThis
      value: Type.TPromise<Type.TThis>
    }>
  > = T.B
  Assert.IsTrue(Type.IsPromise(B))
  Assert.IsTrue(Type.IsObject(B.item))
  Assert.IsTrue(Type.IsThis(B.item.properties.self))
})
Test('Should Indexed 36', () => {
  const T = Type.Script(`
    export interface A { self: this, value: (a: this) => this }
    export type B = A['value']
  `)
  const B: Type.TFunction<
    [
      Type.TObject<{
        self: Type.TThis
        value: Type.TFunction<[Type.TThis], Type.TThis>
      }>
    ],
    Type.TObject<{
      self: Type.TThis
      value: Type.TFunction<[Type.TThis], Type.TThis>
    }>
  > = T.B
  Assert.IsTrue(Type.IsFunction(B))
  Assert.IsTrue(Type.IsObject(B.parameters[0]))
  Assert.IsTrue(Type.IsThis(B.parameters[0].properties.self))
  Assert.IsTrue(Type.IsObject(B.returnType))
  Assert.IsTrue(Type.IsThis(B.returnType.properties.self))
})
Test('Should Indexed 37', () => {
  const T = Type.Script(`
    export interface A { self: this, value: new (a: this) => this }
    export type B = A['value']
  `)
  const B: Type.TConstructor<
    [
      Type.TObject<{
        self: Type.TThis
        value: Type.TConstructor<[Type.TThis], Type.TThis>
      }>
    ],
    Type.TObject<{
      self: Type.TThis
      value: Type.TConstructor<[Type.TThis], Type.TThis>
    }>
  > = T.B
  Assert.IsTrue(Type.IsConstructor(B))
  Assert.IsTrue(Type.IsObject(B.parameters[0]))
  Assert.IsTrue(Type.IsThis(B.parameters[0].properties.self))
  Assert.IsTrue(Type.IsObject(B.instanceType))
  Assert.IsTrue(Type.IsThis(B.instanceType.properties.self))
})
Test('Should Indexed 38', () => {
  const T = Type.Script(`
    export interface A { self: this, value: AsyncIterator<this> }
    export type B = A['value']
  `)
  const B = T.B
  Assert.IsTrue(Type.IsAsyncIterator(B))
  Assert.IsTrue(Type.IsObject(B.iteratorItems))
  Assert.IsTrue(Type.IsThis(B.iteratorItems.properties.self))
})
Test('Should Indexed 39', () => {
  const T = Type.Script(`
    export interface A { self: this, value: Iterator<this> }
    export type B = A['value']
  `)
  const B: Type.TIterator<
    Type.TObject<{
      self: Type.TThis
      value: Type.TIterator<Type.TThis>
    }>
  > = T.B
  Assert.IsTrue(Type.IsIterator(B))
  Assert.IsTrue(Type.IsObject(B.iteratorItems))
  Assert.IsTrue(Type.IsThis(B.iteratorItems.properties.self))
})

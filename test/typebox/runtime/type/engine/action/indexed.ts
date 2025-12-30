import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Index')

// ------------------------------------------------------------------
// Overload
// ------------------------------------------------------------------
Test('Should Index Overload 1', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const K = ['x', 'y'] as const
  const R: Type.TUnion<[Type.TNumber, Type.TString]> = Type.Index(A, K)
  Assert.IsTrue(Type.IsUnion(R))
  Assert.IsTrue(Type.IsNumber(R.anyOf[0]))
  Assert.IsTrue(Type.IsString(R.anyOf[1]))
})
Test('Should Index Overload 2', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const R: Type.TUnion<[Type.TNumber, Type.TString]> = Type.Index(A, ['x', 'y'])
  Assert.IsTrue(Type.IsUnion(R))
  Assert.IsTrue(Type.IsNumber(R.anyOf[0]))
  Assert.IsTrue(Type.IsString(R.anyOf[1]))
})
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should defer Index 1', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Ref('A')
  const T: Type.TDeferred<'Index', [
    Type.TObject<{
      x: Type.TNumber
    }>,
    Type.TRef<'A'>
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Index')
  Assert.IsTrue(Type.IsObject(T.parameters[0]))
  Assert.IsEqual(T.parameters[1].$ref, 'A')
})
Test('Should defer Index 2', () => {
  const A = Type.Ref('A')
  const B = Type.Object({ x: Type.Number() })
  const T: Type.TDeferred<'Index', [
    Type.TRef<'A'>,
    Type.TObject<{
      x: Type.TNumber
    }>
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Index')
  Assert.IsTrue(Type.IsObject(T.parameters[1]))
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
Test('Should defer Index 3', () => {
  const A = Type.Ref('A')
  const B = Type.Ref('B')
  const T: Type.TDeferred<'Index', [Type.TRef<'A'>, Type.TRef<'B'>]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Index')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
  Assert.IsEqual(T.parameters[1].$ref, 'B')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Index 1', () => {
  const A = Type.Object({ x: Type.Number(), y: Type.String() })
  const B = Type.Literal('x')
  const T: Type.TNumber = Type.Index(A, B)
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Index 2', () => {
  const A = Type.Object({ x: Type.Number(), y: Type.String() })
  const B = Type.Literal('y')
  const T: Type.TString = Type.Index(A, B)
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Index 3', () => {
  const A = Type.Object({ x: Type.Number(), y: Type.String() })
  const B = Type.Union([
    Type.Literal('x'),
    Type.Literal('y')
  ])
  const T: Type.TUnion<[
    Type.TNumber,
    Type.TString
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Index 4', () => {
  const A = Type.Object({ x: Type.Number(), y: Type.String() })
  const B = Type.Union([
    Type.Literal('y'),
    Type.Literal('x')
  ])
  const T: Type.TUnion<[
    Type.TString,
    Type.TNumber
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Index 5', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Type.Union([
    Type.Literal('0'),
    Type.Literal('1')
  ])
  const T: Type.TUnion<[
    Type.TString,
    Type.TNumber
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Index 6', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Type.Union([
    Type.Literal('1'),
    Type.Literal('0')
  ])
  const T: Type.TUnion<[ // indexer-does-not-control-order
    Type.TString,
    Type.TNumber
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Index 7', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Type.Union([
    Type.Literal(0),
    Type.Literal(1)
  ])
  const T: Type.TUnion<[
    Type.TString,
    Type.TNumber
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Index 8', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Type.Union([
    Type.Literal(1),
    Type.Literal(0)
  ])
  const T: Type.TUnion<[ // indexer-does-not-control-order
    Type.TString,
    Type.TNumber
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Index 9', () => {
  const A = Type.Object({
    x: Type.Number(),
    0: Type.String(),
    1: Type.Boolean()
  })
  const B = Type.Union([
    Type.Literal('x'),
    Type.Literal(0),
    Type.Literal('1')
  ])
  const T: Type.TUnion<[Type.TNumber, Type.TString, Type.TBoolean]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[2]))
})
Test('Should Index 10', () => {
  const A = Type.Array(Type.String())
  const B = Type.Union([
    Type.Literal(100)
  ])
  const T: Type.TString = Type.Index(A, B)
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Index 11', () => {
  const A = Type.Array(Type.String())
  const B = Type.Union([
    Type.Literal('100')
  ])
  const T: Type.TString = Type.Index(A, B)
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Index 12', () => {
  const A = Type.Array(Type.String())
  const B = Type.Union([
    Type.Literal('x')
  ])
  const T: Type.TNever = Type.Index(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Index 13', () => {
  const A = Type.String()
  const B = Type.Union([Type.Literal('x')])
  const T: Type.TNever = Type.Index(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Index 14', () => {
  const A = Type.Object({
    x: Type.String(),
    y: Type.Number()
  })
  const B = Type.Enum(['x', 'y'])
  const T: Type.TUnion<[
    Type.TString,
    Type.TNumber
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Index 15', () => {
  const A = Type.Object({
    x: Type.String(),
    y: Type.Number()
  })
  const B = Type.Enum(['y', 'x'])
  const T: Type.TUnion<[
    Type.TNumber,
    Type.TString
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Index 16', () => {
  const A = Type.Object({
    x: Type.String(),
    y: Type.Number()
  })
  const B = Type.Enum(['z'])
  const T: Type.TNever = Type.Index(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Index 17', () => {
  const A = Type.Object({
    x: Type.String(),
    y: Type.Number()
  })
  const T: Type.TUnion<[
    Type.TString,
    Type.TNumber
  ]> = Type.Index(A, ['x', 'y'])
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Index 18', () => {
  const A = Type.Object({
    x: Type.String(),
    y: Type.Number()
  })
  const T: Type.TUnion<[
    Type.TNumber,
    Type.TString
  ]> = Type.Index(A, ['y', 'x'])
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Index 19', () => {
  const A = Type.Object({
    x: Type.String(),
    y: Type.Number()
  })
  const T: Type.TNever = Type.Index(A, ['z'])
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Index 20', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.String() }),
    Type.Object({ y: Type.Number() })
  ])
  const B = Type.Union([
    Type.Literal('x'),
    Type.Literal('y')
  ])
  const T: Type.TUnion<[
    Type.TString,
    Type.TNumber
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Index 21', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.String() }),
    Type.Object({ y: Type.Number() })
  ])
  const B = Type.Union([ // indexer-reverse
    Type.Literal('y'),
    Type.Literal('x')
  ])
  const T: Type.TUnion<[
    Type.TNumber,
    Type.TString
  ]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Index 22', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.String() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Boolean() })
    ])
  ])
  const B = Type.Union([
    Type.Literal('y'),
    Type.Literal('x'),
    Type.Literal('z')
  ])
  const T: Type.TSchema = Type.Index(A, B) // only index overlapped
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Index 23', () => {
  const A = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.String() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Boolean() })
    ])
  ]))
  const B = Type.Union([
    Type.Literal('y'),
    Type.Literal('x'),
    Type.Literal('z')
  ])
  const T: Type.TSchema = Type.Index(A, B) // only index overlapped
  Assert.IsTrue(Type.IsString(T))
})
// ------------------------------------------------------------------
// Tuple: Coverage
// ------------------------------------------------------------------
Test('Should Index 24', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String()
  ])
  const B = Type.Number()
  const T: Type.TUnion<[Type.TNumber, Type.TString]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Index 25', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String()
  ])
  const B = Type.Integer()
  const T: Type.TUnion<[Type.TNumber, Type.TString]> = Type.Index(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Index 26', () => {
  const A = Type.Tuple([Type.Null(), Type.Null()])
  const B = Type.Intersect([Type.Literal(0), Type.Literal(1)])
  const T: Type.TNever = Type.Index(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
// ------------------------------------------------------------------
// Array: Coverage
// ------------------------------------------------------------------
Test('Should Index 27', () => {
  const A = Type.Array(Type.Null())
  const B = Type.String()
  const T: Type.TNever = Type.Index(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Index 28', () => {
  const A = Type.Array(Type.Null())
  const B = Type.Literal(1)
  const T: Type.TNull = Type.Index(A, B)
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Index 29', () => {
  const A = Type.Array(Type.Null())
  const B = Type.Intersect([Type.Literal(1), Type.Literal(1)])
  const T: Type.TNull = Type.Index(A, B)
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Index 30', () => {
  const A = Type.Array(Type.Null())
  const B = Type.Intersect([Type.Literal(1), Type.Literal(2)])
  const T: Type.TNull = Type.Index(A, B)
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Index 31', () => {
  const A = Type.Array(Type.Null())
  const B = Type.Union([Type.Literal(1), Type.Literal(2)])
  const T: Type.TNull = Type.Index(A, B)
  Assert.IsTrue(Type.IsNull(T))
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1391
//
// CollapseToObject / Indexable Should take a Union of Overlapping
// PropertyKeys. We should review this against Evaluate behaviors
// ------------------------------------------------------------------
Test('Should Index 32', () => {
  // TypeScript
  type A = { type: 'a'; a: string }
  type B = { type: 'b'; b: string }
  type C = { type: 'c'; c: string }
  type ABC = A | B | C
  type R = ABC['type']
  Assert.IsExtendsMutual<R, 'b' | 'a' | 'c'>(true)
  // TypeBox
  const A = Type.Object({ type: Type.Literal('a'), a: Type.String() })
  const B = Type.Object({ type: Type.Literal('b'), b: Type.String() })
  const C = Type.Object({ type: Type.Literal('c'), c: Type.String() })
  const ABC = Type.Union([A, B, C])
  const R: Type.TUnion<[
    Type.TLiteral<'a'>,
    Type.TLiteral<'b'>,
    Type.TLiteral<'c'>
  ]> = Type.Index(ABC, Type.Literal('type'))
  Assert.IsTrue(Type.IsUnion(R))
  Assert.IsEqual(R.anyOf[0].const, 'a')
  Assert.IsEqual(R.anyOf[1].const, 'b')
  Assert.IsEqual(R.anyOf[2].const, 'c')
})
// ------------------------------------------------------------------
// EvaluateUnionFast
// ------------------------------------------------------------------
Test('Should Index 33', () => {
  const T = Type.Object({})
  const K: Type.TNever = Type.Index(T, Type.KeyOf(T))
  Assert.IsTrue(Type.IsNever(K))
})
Test('Should Index 34', () => {
  const T = Type.Object({
    x: Type.Number()
  })
  const K: Type.TNumber = Type.Index(T, Type.KeyOf(T))
  Assert.IsTrue(Type.IsNumber(K))
})
Test('Should Index 35', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.String()
  })
  // DENO_CACHE_ERROR | EDIT FILE AND RE-RUN TEST
  const K: Type.TUnion<[Type.TNumber, Type.TString]> = Type.Index(T, Type.KeyOf(T))
  Assert.IsTrue(Type.IsUnion(K))
  Assert.IsTrue(Type.IsNumber(K.anyOf[0]))
  Assert.IsTrue(Type.IsString(K.anyOf[1]))
})

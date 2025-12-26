import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.KeyOf')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should KeyOf 1', () => {
  const A = Type.Ref('A')
  const T: Type.TDeferred<'KeyOf', [Type.TRef<'A'>]> = Type.KeyOf(A)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'KeyOf')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should KeyOf 2', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  // DENO_CACHE_ERROR | EDIT FILE AND RE-RUN TEST
  const T: Type.TUnion<[
    Type.TLiteral<'x'>,
    Type.TLiteral<'y'>,
    Type.TLiteral<'z'>
  ]> = Type.KeyOf(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'x')
  Assert.IsEqual(T.anyOf[1].const, 'y')
  Assert.IsEqual(T.anyOf[2].const, 'z')
})
Test('Should KeyOf 3', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.Number(),
    Type.Number()
  ])
  const T: Type.TUnion<[
    Type.TLiteral<0>,
    Type.TLiteral<1>,
    Type.TLiteral<2>
  ]> = Type.KeyOf(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 0)
  Assert.IsEqual(T.anyOf[1].const, 1)
  Assert.IsEqual(T.anyOf[2].const, 2)
})
Test('Should KeyOf 4', () => {
  const A = Type.Array(Type.Null())
  const T: Type.TNumber = Type.KeyOf(A)
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should KeyOf 5', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  // DENO_CACHE_ERROR | EDIT FILE AND RE-RUN TEST
  const T: Type.TUnion<[
    Type.TLiteral<'x'>,
    Type.TLiteral<'y'>,
    Type.TLiteral<'z'>
  ]> = Type.KeyOf(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'x')
  Assert.IsEqual(T.anyOf[1].const, 'y')
  Assert.IsEqual(T.anyOf[2].const, 'z')
})
Test('Should KeyOf 6', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Number() })
    ])
  ])
  const T: Type.TLiteral<'x'> = Type.KeyOf(A)
  Assert.IsEqual(T.const, 'x')
})
Test('Should KeyOf 7', () => {
  const A = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Number() })
    ])
  ]))
  const T: Type.TLiteral<'x'> = Type.KeyOf(A)
  Assert.IsEqual(T.const, 'x')
})
Test('Should KeyOf 8', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ b: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Number() })
    ])
  ])
  // DENO_CACHE_ERROR | EDIT FILE AND RE-RUN TEST
  const T: Type.TUnion<[Type.TLiteral<'x'>, Type.TLiteral<'b'>]> = Type.KeyOf(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'x')
  Assert.IsEqual(T.anyOf[1].const, 'b')
})
Test('Should KeyOf 9', () => {
  const A = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ b: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Number() })
    ])
  ]))
  // DENO_CACHE_ERROR | EDIT FILE AND RE-RUN TEST
  const T: Type.TUnion<[Type.TLiteral<'x'>, Type.TLiteral<'b'>]> = Type.KeyOf(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'x')
  Assert.IsEqual(T.anyOf[1].const, 'b')
})
// ------------------------------------------------------------------
// Evaluated Types
// ------------------------------------------------------------------
Test('Should KeyOf 10', () => {
  const A = Type.Intersect([
    Type.Union([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Union([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
  ])
  // this is incorrect, we expect the following type. It would be ok
  // to break this test but need to figure out how to evaluate the
  // following type. We currently evaluate as TNever.
  //
  // type A =
  //  | { x: number }
  //  | { x: number, y: number }
  //  | { y: number, x: number }
  //  | { y: number }
  const T: Type.TNever = Type.KeyOf(A)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should KeyOf 11', () => {
  const A = Type.Evaluate(Type.Intersect([
    Type.Union([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Union([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
  ]))
  // this is incorrect, we expect the following type. It would be ok
  // to break this test but need to figure out how to evaluate the
  // following type. We currently evaluate as TNever.
  //
  // type A =
  //  | { x: number }
  //  | { x: number, y: number }
  //  | { y: number, x: number }
  //  | { y: number }
  const T: Type.TNever = Type.KeyOf(A)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should KeyOf 12', () => {
  const A = Type.Evaluate(Type.Union([
    Type.Object({ x: Type.Number(), y: Type.String() }),
    Type.Object({ x: Type.Number(), y: Type.String() })
  ]))
  // DENO_CACHE_ERROR | EDIT FILE AND RE-RUN TEST
  const T: Type.TUnion<[Type.TLiteral<'x'>, Type.TLiteral<'y'>]> = Type.KeyOf(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'x')
  Assert.IsEqual(T.anyOf[1].const, 'y')
})
Test('Should KeyOf 13', () => {
  const A = Type.Object({})
  const T: Type.TNever = Type.KeyOf(A)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should KeyOf 14', () => {
  const A = Type.Tuple([])
  const T: Type.TNever = Type.KeyOf(A)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should KeyOf 15', () => {
  const A = Type.Number()
  const T: Type.TNever = Type.KeyOf(A)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should KeyOf 16', () => {
  const A = Type.Array(Type.Never())
  const T: Type.TNumber = Type.KeyOf(A)
  Assert.IsTrue(Type.IsNumber(T))
})
// ------------------------------------------------------------------
// Deep Evaluated Types
// ------------------------------------------------------------------
Test('Should KeyOf 17', () => {
  const A = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  // DENO_CACHE_ERROR | EDIT FILE AND RE-RUN TEST
  const T: Type.TUnion<[
    Type.TLiteral<'x'>,
    Type.TLiteral<'y'>,
    Type.TLiteral<'z'>,
    Type.TLiteral<'w'>
  ]> = Type.KeyOf(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'x')
  Assert.IsEqual(T.anyOf[1].const, 'y')
  Assert.IsEqual(T.anyOf[2].const, 'z')
  Assert.IsEqual(T.anyOf[3].const, 'w')
})
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
Test('Should KeyOf 18', () => {
  const T = Type.Record(Type.Number(), Type.Null())
  const K: Type.TNumber = Type.KeyOf(T)
  Assert.IsTrue(Type.IsNumber(K))
})
Test('Should KeyOf 19', () => {
  const T = Type.Record(Type.Integer(), Type.Null())
  const K: Type.TInteger = Type.KeyOf(T)
  Assert.IsTrue(Type.IsInteger(K))
})
Test('Should KeyOf 20', () => {
  const T: Type.TObject<{}> = Type.Record(Type.BigInt(), Type.Null())
  const K: Type.TNever = Type.KeyOf(T)
  Assert.IsTrue(Type.IsNever(K))
})
Test('Should KeyOf 21', () => {
  const T = Type.Record(Type.String(), Type.Null())
  const K: Type.TString = Type.KeyOf(T)
  Assert.IsTrue(Type.IsString(K))
})
// ------------------------------------------------------------------
// Object: Symbols Ignored
// ------------------------------------------------------------------
Test('Should KeyOf 22', () => {
  const S = Symbol()
  const T = Type.Object({
    [S]: Type.String(),
    x: Type.Number()
  })
  const K: Type.TLiteral<'x'> = Type.KeyOf(T)
  Assert.IsTrue(Type.IsLiteral(K))
  Assert.IsEqual(K.const, 'x')
})
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
Test('Should KeyOf 23', () => {
  const T: Type.TUnion<[Type.TNumber, Type.TString, Type.TSymbol]> = Type.KeyOf(Type.Any())
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
  Assert.IsTrue(Type.IsSymbol(T.anyOf[2]))
})
// ------------------------------------------------------------------
// EvaluateUnionFast
// ------------------------------------------------------------------
Test('Should KeyOf 24', () => {
  const T = Type.Object({})
  const K: Type.TNever = Type.KeyOf(T)
  Assert.IsTrue(Type.IsNever(K))
})
Test('Should KeyOf 25', () => {
  const T = Type.Object({
    x: Type.Number()
  })
  const K: Type.TLiteral<'x'> = Type.KeyOf(T)
  Assert.IsEqual(K.const, 'x')
})
Test('Should KeyOf 26', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.String()
  })
  const K: Type.TUnion<[Type.TLiteral<'x'>, Type.TLiteral<'y'>]> = Type.KeyOf(T)
  Assert.IsTrue(Type.IsUnion(K))
  Assert.IsEqual(K.anyOf[0].const, 'x')
  Assert.IsEqual(K.anyOf[1].const, 'y')
})

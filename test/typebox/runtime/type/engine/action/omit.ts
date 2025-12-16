import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Engine.Omit')

// ------------------------------------------------------------------
// Overload
// ------------------------------------------------------------------
Test('Should Omit Overload 1', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const K = ['x', 'y'] as const
  const R: Type.TObject<{
    z: Type.TNumber
  }> = Type.Omit(A, K)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties.z))
})
Test('Should Omit Overload 2', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const R: Type.TObject<{
    z: Type.TNumber
  }> = Type.Omit(A, ['x', 'y'])
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties.z))
})
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Omit 1', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Ref('B')
  const T: Type.TDeferred<'Omit', [
    Type.TObject<{
      x: Type.TNumber
    }>,
    Type.TRef<'B'>
  ]> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsObject(T.parameters[0]))
  Assert.IsTrue(Type.IsRef(T.parameters[1]))
  Assert.IsEqual(T.parameters[1].$ref, 'B')
})
Test('Should Omit 2', () => {
  const A = Type.Ref('A')
  const B = Type.Literal('x')
  const T: Type.TDeferred<'Omit', [Type.TRef<'A'>, Type.TLiteral<'x'>]> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsEqual(T.parameters[0].$ref, 'A')
  Assert.IsTrue(Type.IsLiteral(T.parameters[1]))
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Omit 3', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const B = Type.Literal('x')
  const T: Type.TObject<{ y: Type.TString; z: Type.TBoolean }> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsTrue(Type.IsBoolean(T.properties.z))
  Assert.IsEqual(T.required, ['y', 'z'])
})
Test('Should Omit 4', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const B = Type.Union([
    Type.Literal('x'),
    Type.Literal('y')
  ])
  const T: Type.TObject<{ z: Type.TBoolean }> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsBoolean(T.properties.z))
  Assert.IsEqual(T.required, ['z'])
})
Test('Should Omit 5', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const B = Type.Union([
    Type.Literal('x'),
    Type.Literal('y'),
    Type.Literal('z')
  ])
  const T: Type.TObject<{}> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.required, undefined)
})
Test('Should Omit 6', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const B = Type.KeyOf(A)
  const T: Type.TObject<{}> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.required, undefined)
})
Test('Should Omit 7', () => {
  const A = Type.Object({
    x: Type.Optional(Type.Number()),
    y: Type.Readonly(Type.String()),
    z: Type.Readonly(Type.Optional(Type.Boolean()))
  })
  const B = Type.Union([
    Type.Literal('x'),
    Type.Literal('y'),
    Type.Literal('z')
  ])
  const T: Type.TObject<{}> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.required, undefined)
})
Test('Should Omit 8', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Literal('0')
  const T: Type.TObject<{ 1: Type.TString; 2: Type.TBoolean }> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties[1]))
  Assert.IsTrue(Type.IsBoolean(T.properties[2]))
  Assert.IsEqual(T.required, ['1', '2'])
})
Test('Should Omit 9', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Union([
    Type.Literal('0'),
    Type.Literal('1')
  ])
  const T: Type.TObject<{ 2: Type.TBoolean }> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsBoolean(T.properties[2]))
  Assert.IsEqual(T.required, ['2'])
})
Test('Should Omit 10', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Union([
    Type.Literal('0'),
    Type.Literal('1'),
    Type.Literal('2')
  ])
  const T: Type.TObject<{}> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.required, undefined)
})
Test('Should Omit 11', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Union([
    Type.Literal('0'),
    Type.Literal('2')
  ])
  const T: Type.TObject<{ 1: Type.TString }> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties[1]))
  Assert.IsEqual(T.required, ['1'])
})
Test('Should Omit 12', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Literal(0)
  const T: Type.TObject<{ 1: Type.TString; 2: Type.TBoolean }> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties[1]))
  Assert.IsTrue(Type.IsBoolean(T.properties[2]))
  Assert.IsEqual(T.required, ['1', '2'])
})
Test('Should Omit 13', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Union([
    Type.Literal(0),
    Type.Literal(1)
  ])
  const T: Type.TObject<{ 2: Type.TBoolean }> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsBoolean(T.properties[2]))
  Assert.IsEqual(T.required, ['2'])
})
Test('Should Omit 14', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Union([
    Type.Literal(0),
    Type.Literal(1),
    Type.Literal(2)
  ])
  const T: Type.TObject<{}> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.required, undefined)
})
Test('Should Omit 15', () => {
  const A = Type.String()
  const B = Type.Union([
    Type.Literal(0),
    Type.Literal(1),
    Type.Literal(2)
  ])
  const T: Type.TObject<{}> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
})
Test('Should Omit 16', () => {
  const A = Type.Array(Type.Null())
  const B = Type.Union([
    Type.Literal(0),
    Type.Literal(1),
    Type.Literal(2)
  ])
  const T: Type.TObject<{}> = Type.Omit(A, B)
  Assert.IsTrue(Type.IsObject(T))
})
// -----------------------------------------------------------
// Omit: Coverage
// -----------------------------------------------------------
Test('Should Omit 17', () => {
  const A = Type.Number()
  const T = Type.Omit(A, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties), [])
})
Test('Should Omit 18', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{
    y: Type.TNumber
    z: Type.TNumber
  }> = Type.Omit(A, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, 'x')
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
})
Test('Should Omit 19', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{
    z: Type.TNumber
  }> = Type.Omit(
    A,
    Type.Union([
      Type.Literal('x'),
      Type.Literal('y')
    ])
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, 'x')
  Assert.NotHasPropertyKey(T.properties, 'y')
  Assert.IsTrue(Type.IsNumber(T.properties.z))
})
Test('Should Omit 20', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{
    y: Type.TNumber
    z: Type.TNumber
  }> = Type.Omit(A, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, 'x')
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
})
Test('Should Omit 21', () => {
  const A = Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{}> = Type.Omit(
    A,
    Type.Union([
      Type.Literal('x'),
      Type.Literal('y')
    ])
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties), [])
})
Test('Should Omit 22', () => {
  const A = Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{}> = Type.Omit(A, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties), [])
})
Test('Should Omit 23', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.Number(),
    Type.Number()
  ])
  const T: Type.TObject<{
    1: Type.TNumber
    2: Type.TNumber
  }> = Type.Omit(A, Type.Literal('0'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, '0')
  Assert.IsTrue(Type.IsNumber(T.properties['1']))
  Assert.IsTrue(Type.IsNumber(T.properties['2']))
})
Test('Should Omit 24', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.Number(),
    Type.Number()
  ])
  const T: Type.TObject<{
    2: Type.TNumber
  }> = Type.Omit(
    A,
    Type.Union([
      Type.Literal('0'),
      Type.Literal('1')
    ])
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, '0')
  Assert.NotHasPropertyKey(T.properties, '1')
  Assert.IsTrue(Type.IsNumber(T.properties['2']))
})
// -----------------------------------------------------------
// Omit: More Coverage
// -----------------------------------------------------------
Test('Should Omit 25', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T: Type.TObject<{
    z: Type.TNumber
  }> = Type.Omit(A, Type.TemplateLiteral('${"x" | "y"}'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, 'x')
  Assert.NotHasPropertyKey(T.properties, 'y')
  Assert.IsTrue(Type.IsNumber(T.properties['z']))
})
Test('Should Omit 26', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T: Type.TObject<{
    y: Type.TNumber
    z: Type.TNumber
  }> = Type.Omit(
    A,
    Type.Intersect([
      Type.Literal('x'),
      Type.Literal('x')
    ])
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, 'x')
  Assert.IsTrue(Type.IsNumber(T.properties['y']))
  Assert.IsTrue(Type.IsNumber(T.properties['z']))
})
// -----------------------------------------------------------
// Omit: Invalid Key
// -----------------------------------------------------------
Test('Should Omit 27', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T: Type.TObject<{
    y: Type.TNumber
  }> = Type.Omit(A, ['x', Symbol(), 'z'])
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, 'x')
  Assert.NotHasPropertyKey(T.properties, 'z')
  Assert.IsTrue(Type.IsNumber(T.properties['y']))
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1391
//
// CollapseToObject / Indexable Should take a Union of Overlapping
// PropertyKeys. We should review this against Evaluate behaviors
// ------------------------------------------------------------------
Test('Should Omit 28', () => {
  // TypeScript
  type A = { type: 'a'; a: string }
  type B = { type: 'b'; b: string }
  type C = { type: 'c'; c: string }
  type ABC = A | B | C
  type AB = Omit<ABC, 'c'>
  Assert.IsExtendsMutual<AB, {
    type: 'b' | 'a' | 'c' // expect union
  }>(true)
  // TypeBox
  const A = Type.Object({ type: Type.Literal('a'), a: Type.String() })
  const B = Type.Object({ type: Type.Literal('b'), b: Type.String() })
  const C = Type.Object({ type: Type.Literal('c'), c: Type.String() })
  const ABC = Type.Union([A, B, C])
  const AB: Type.TObject<{
    type: Type.TUnion<[
      Type.TLiteral<'a'>,
      Type.TLiteral<'b'>,
      Type.TLiteral<'c'>
    ]>
  }> = Type.Omit(ABC, Type.Literal('c'))
  Assert.IsTrue(Type.IsObject(AB))
  Assert.IsTrue(Type.IsUnion(AB.properties.type))
  Assert.IsEqual(AB.properties.type.anyOf[0].const, 'a')
  Assert.IsEqual(AB.properties.type.anyOf[1].const, 'b')
  Assert.IsEqual(AB.properties.type.anyOf[2].const, 'c')
})
// ------------------------------------------------------------------
// More Intersect
// ------------------------------------------------------------------
Test('Should Omit 29', () => {
  const X = Type.Object({ x: Type.Number(), z: Type.Literal(1) })
  const Y = Type.Object({ y: Type.String(), z: Type.Number() })
  const Z = Type.Intersect([X, Y])
  const T: Type.TObject<{
    y: Type.TString
    z: Type.TLiteral<1>
  }> = Type.Omit(Z, ['x'])
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsEqual(T.properties.z.const, 1)
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
Test('Should Omit 30', () => {
  const X = Type.Object({ x: Type.Number(), z: Type.Literal(1) })
  const Y = Type.Object({ y: Type.String(), z: Type.Number() })
  const Z = Type.Intersect([X, Y])
  const T: Type.TObject<{
    x: Type.TNumber
    z: Type.TLiteral<1>
  }> = Type.Omit(Z, ['y'])
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsEqual(T.properties.z.const, 1)
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})
Test('Should Omit 31', () => {
  const X = Type.Object({ x: Type.Number(), z: Type.Literal(1) })
  const Y = Type.Object({ y: Type.String(), z: Type.Number() })
  const Z = Type.Intersect([X, Y])
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TString
  }> = Type.Omit(Z, ['z'])
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 2)
})

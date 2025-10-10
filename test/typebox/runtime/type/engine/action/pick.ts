import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Engine.Pick')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Pick 1', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Ref('B')
  const T: Type.TDeferred<'Pick', [
    Type.TObject<{
      x: Type.TNumber
    }>,
    Type.TRef<'B'>
  ]> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsObject(T.parameters[0]))
  Assert.IsTrue(Type.IsRef(T.parameters[1]))
  Assert.IsEqual(T.parameters[1].$ref, 'B')
})
Test('Should Pick 2', () => {
  const A = Type.Ref('A')
  const B = Type.Literal('x')
  const T: Type.TDeferred<'Pick', [Type.TRef<'A'>, Type.TLiteral<'x'>]> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsEqual(T.parameters[0].$ref, 'A')
  Assert.IsTrue(Type.IsLiteral(T.parameters[1]))
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Pick 3', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const B = Type.Literal('x')
  const T: Type.TObject<{ x: Type.TNumber }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsEqual(T.required, ['x'])
})
Test('Should Pick 4', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const B = Type.Union([
    Type.Literal('x'),
    Type.Literal('y')
  ])
  const T: Type.TObject<{ x: Type.TNumber; y: Type.TString }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsEqual(T.required, ['x', 'y'])
})
Test('Should Pick 5', () => {
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
  const T: Type.TObject<{ x: Type.TNumber; y: Type.TString; z: Type.TBoolean }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsTrue(Type.IsBoolean(T.properties.z))
  Assert.IsEqual(T.required, ['x', 'y', 'z'])
})
Test('Should Pick 6', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.String(),
    z: Type.Boolean()
  })
  const B = Type.KeyOf(A)
  const T: Type.TObject<{ x: Type.TNumber; y: Type.TString; z: Type.TBoolean }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsTrue(Type.IsBoolean(T.properties.z))
  Assert.IsEqual(T.required, ['x', 'y', 'z'])
})
Test('Should Pick 7', () => {
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
  const T: Type.TObject<{ x: Type.TNumber; y: Type.TString; z: Type.TBoolean }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsTrue(Type.IsReadonly(T.properties.y))
  Assert.IsTrue(Type.IsBoolean(T.properties.z))
  Assert.IsTrue(Type.IsReadonly(T.properties.z))
  Assert.IsTrue(Type.IsOptional(T.properties.z))
  Assert.IsEqual(T.required, ['y'])
})

Test('Should Pick 8', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Literal('0')
  const T: Type.TObject<{ 0: Type.TNumber }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsEqual(T.required, ['0'])
})
Test('Should Pick 6', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Union([
    Type.Literal('0'),
    Type.Literal('1')
  ])
  const T: Type.TObject<{ 0: Type.TNumber; 1: Type.TString }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsTrue(Type.IsString(T.properties[1]))
  Assert.IsEqual(T.required, ['0', '1'])
})
Test('Should Pick 9', () => {
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
  const T: Type.TObject<{ 0: Type.TNumber; 1: Type.TString; 2: Type.TBoolean }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsTrue(Type.IsString(T.properties[1]))
  Assert.IsTrue(Type.IsBoolean(T.properties[2]))
  Assert.IsEqual(T.required, ['0', '1', '2'])
})
Test('Should Pick 10', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Union([
    Type.Literal('0'),
    Type.Literal('2')
  ])
  const T: Type.TObject<{ 0: Type.TNumber; 2: Type.TBoolean }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsTrue(Type.IsBoolean(T.properties[2]))
  Assert.IsEqual(T.required, ['0', '2'])
})
Test('Should Pick 11', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Literal(0)
  const T: Type.TObject<{ 0: Type.TNumber }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsEqual(T.required, ['0'])
})
Test('Should Pick 12', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.String(),
    Type.Boolean()
  ])
  const B = Type.Union([
    Type.Literal(0),
    Type.Literal(1)
  ])
  const T: Type.TObject<{ 0: Type.TNumber; 1: Type.TString }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsTrue(Type.IsString(T.properties[1]))
  Assert.IsEqual(T.required, ['0', '1'])
})
Test('Should Pick 13', () => {
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
  const T: Type.TObject<{ 0: Type.TNumber; 1: Type.TString; 2: Type.TBoolean }> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsTrue(Type.IsString(T.properties[1]))
  Assert.IsTrue(Type.IsBoolean(T.properties[2]))
  Assert.IsEqual(T.required, ['0', '1', '2'])
})
Test('Should Pick 14', () => {
  const A = Type.String()
  const B = Type.Union([
    Type.Literal(0),
    Type.Literal(1),
    Type.Literal(2)
  ])
  const T: Type.TObject<{}> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
})
Test('Should Pick 15', () => {
  const A = Type.Array(Type.Null())
  const B = Type.Union([
    Type.Literal(0),
    Type.Literal(1),
    Type.Literal(2)
  ])
  const T: Type.TObject<{}> = Type.Pick(A, B)
  Assert.IsTrue(Type.IsObject(T))
})
// -----------------------------------------------------------
// Pick: Coverage
// -----------------------------------------------------------
Test('Should Pick 16', () => {
  const A = Type.Number()
  const T: Type.TObject<{}> = Type.Pick(A, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties), [])
})
Test('Should Pick 17', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Pick(A, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.NotHasPropertyKey(T.properties, 'y')
  Assert.NotHasPropertyKey(T.properties, 'z')
})
Test('Should Pick 18', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Pick(
    A,
    Type.Union([
      Type.Literal('x'),
      Type.Literal('y')
    ])
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.NotHasPropertyKey(T.properties, 'z')
})
Test('Should Pick 19', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Pick(A, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.NotHasPropertyKey(T.properties, 'y')
  Assert.NotHasPropertyKey(T.properties, 'z')
})
Test('Should Pick 20', () => {
  const A = Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{}> = Type.Pick(
    A,
    Type.Union([
      Type.Literal('x'),
      Type.Literal('y')
    ])
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties), [])
})
Test('Should Pick 21', () => {
  const A = Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T = Type.Pick(A, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties), [])
})
Test('Should Pick 22', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.Number(),
    Type.Number()
  ])
  const T: Type.TObject<{
    0: Type.TNumber
  }> = Type.Pick(A, Type.Literal('0'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties['0']))
  Assert.NotHasPropertyKey(T.properties, '1')
  Assert.NotHasPropertyKey(T.properties, '2')
})
Test('Should Pick 23', () => {
  const A = Type.Tuple([
    Type.Number(),
    Type.Number(),
    Type.Number()
  ])
  const T: Type.TObject<{
    0: Type.TNumber
    1: Type.TNumber
  }> = Type.Pick(
    A,
    Type.Union([
      Type.Literal('0'),
      Type.Literal('1')
    ])
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, '2')
  Assert.IsTrue(Type.IsNumber(T.properties['0']))
  Assert.IsTrue(Type.IsNumber(T.properties['1']))
})
// -----------------------------------------------------------
// Pick: More Coverage
// -----------------------------------------------------------
Test('Should Pick 24', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Pick(A, Type.TemplateLiteral('${"x" | "y"}'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, 'z')
  Assert.IsTrue(Type.IsNumber(T.properties['x']))
  Assert.IsTrue(Type.IsNumber(T.properties['y']))
})
Test('Should Pick 25', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Pick(
    A,
    Type.Intersect([
      Type.Literal('x'),
      Type.Literal('x')
    ])
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties['x']))
  Assert.NotHasPropertyKey(T.properties, 'z')
  Assert.NotHasPropertyKey(T.properties, 'y')
})
// -----------------------------------------------------------
// Pick: Invalid Key
// -----------------------------------------------------------
Test('Should Pick 26', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T: Type.TObject<{
    x: Type.TNumber
    z: Type.TNumber
  }> = Type.Pick(A, ['x', Symbol(), 'z'])
  Assert.IsTrue(Type.IsObject(T))
  Assert.NotHasPropertyKey(T.properties, 'y')
  Assert.IsTrue(Type.IsNumber(T.properties['x']))
  Assert.IsTrue(Type.IsNumber(T.properties['z']))
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1391
//
// CollapseToObject / Indexable Should take a Union of Overlapping
// PropertyKeys. We should review this against Evaluate behaviors
// ------------------------------------------------------------------
Test('Should Pick 27', () => {
  // TypeScript
  type A = { type: 'a'; a: string }
  type B = { type: 'b'; b: string }
  type C = { type: 'c'; c: string }
  type ABC = A | B | C
  type AB = Pick<ABC, 'type'>
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
  }> = Type.Pick(ABC, Type.Literal('type'))
  Assert.IsTrue(Type.IsObject(AB))
  Assert.IsTrue(Type.IsUnion(AB.properties.type))
  Assert.IsEqual(AB.properties.type.anyOf[0].const, 'a')
  Assert.IsEqual(AB.properties.type.anyOf[1].const, 'b')
  Assert.IsEqual(AB.properties.type.anyOf[2].const, 'c')
})

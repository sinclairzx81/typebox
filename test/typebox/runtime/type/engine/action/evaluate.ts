import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Evaluate')

// ------------------------------------------------------------------
// Evaluate: Intersect
// ------------------------------------------------------------------
Test('Should Evaluate 1', () => {
  const T: Type.TNever = Type.Evaluate(Type.Intersect([]))
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 2', () => {
  const T: Type.TNumber = Type.Evaluate(Type.Intersect([
    Type.Number()
  ]))
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Evaluate 3', () => {
  const T: Type.TNever = Type.Evaluate(Type.Intersect([
    Type.Number(),
    Type.String()
  ]))
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 4', () => {
  const T: Type.TLiteral<1> = Type.Evaluate(Type.Intersect([
    Type.Number(),
    Type.Literal(1)
  ]))
  Assert.IsTrue(Type.IsLiteral(T))
})
Test('Should Evaluate 5', () => {
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TString
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.String() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
})
Test('Should Evaluate 6', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 7', () => {
  const T: Type.TObject<{
    x: Type.TNever
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.String() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNever(T.properties.x))
})
Test('Should Evaluate 8', () => {
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
    z: Type.TNumber
    w: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
  Assert.IsTrue(Type.IsNumber(T.properties.w))
})
// ------------------------------------------------------------------
// Evaluate: Intersect Tuple as Object
// ------------------------------------------------------------------
Test('Should Evaluate 9', () => {
  const T: Type.TObject<{
    x: Type.TNumber
    0: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Tuple([Type.Number()])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
})
Test('Should Evaluate 10', () => {
  const T: Type.TObject<{
    0: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Tuple([Type.Number()]),
    Type.Tuple([Type.Number()])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
})
Test('Should Evaluate 11', () => {
  const T: Type.TObject<{
    0: Type.TNever
  }> = Type.Evaluate(Type.Intersect([
    Type.Tuple([Type.String()]),
    Type.Tuple([Type.Number()])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNever(T.properties[0]))
})
Test('Should Evaluate 12', () => {
  const T: Type.TObject<{
    0: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Tuple([Type.Optional(Type.Number())]),
    Type.Tuple([Type.Number()])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsFalse(Type.IsOptional(T.properties[0]))
})
Test('Should Evaluate 13', () => {
  const T: Type.TObject<{
    0: Type.TOptional<Type.TNumber>
  }> = Type.Evaluate(Type.Intersect([
    Type.Tuple([Type.Optional(Type.Number())]),
    Type.Tuple([Type.Optional(Type.Number())])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsTrue(Type.IsOptional(T.properties[0]))
})
// ------------------------------------------------------------------
// Evaluate: Composite
// ------------------------------------------------------------------
Test('Should Evaluate 14', () => {
  const T: Type.TObject<{ x: Type.TNumber }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Number()
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 15', () => {
  const T: Type.TObject<{ x: Type.TNumber; y: Type.TNumber }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Number()
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
})
Test('Should Evaluate 16', () => {
  const T: Type.TObject<{ x: Type.TNumber; y: Type.TNumber }> = Type.Evaluate(Type.Intersect([
    Type.Number(),
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
})
Test('Should Evaluate 17', () => {
  const T: Type.TObject<{ x: Type.TNumber }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Array(Type.Number())
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
// ------------------------------------------------------------------
// Evaluate: Modifier
// ------------------------------------------------------------------
Test('Should Evaluate 18', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Optional(Type.Number()) }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 19', () => {
  const T: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Optional(Type.Number()) }),
    Type.Object({ x: Type.Optional(Type.Number()) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 20', () => {
  const T: Type.TObject<{
    x: Type.TOptional<Type.TLiteral<1>>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Optional(Type.Literal(1)) }),
    Type.Object({ x: Type.Optional(Type.Number()) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 21', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Optional(Type.Literal(1)) }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 22', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Optional(Type.Literal(1)) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 23', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Readonly(Type.Number()) }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
})
Test('Should Evaluate 24', () => {
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Readonly(Type.Number()) }),
    Type.Object({ x: Type.Readonly(Type.Number()) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
})
Test('Should Evaluate 25', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Readonly(Type.Literal(1)) }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
})
Test('Should Evaluate 26', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Readonly(Type.Literal(1)) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
})
Test('Should Evaluate 27', () => {
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TLiteral<1>>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Readonly(Type.Literal(1)) }),
    Type.Object({ x: Type.Readonly(Type.Number()) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
})
// ------------------------------------------------------------------
// Evaluate: Union
// ------------------------------------------------------------------
Test('Should Evaluate 28', () => {
  const T: Type.TNever = Type.Evaluate(Type.Union([]))
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 29', () => {
  const T: Type.TNumber = Type.Evaluate(Type.Union([Type.Number()]))
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Evaluate 30', () => {
  const T: Type.TUnion<[Type.TNumber, Type.TString]> = Type.Evaluate(Type.Union([Type.Number(), Type.String()]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Evaluate 31', () => {
  const T: Type.TNumber = Type.Evaluate(Type.Union([Type.Number(), Type.Number()]))
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Evaluate 32', () => {
  const T: Type.TNumber = Type.Evaluate(Type.Union([Type.Literal(1), Type.Number()]))
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Evaluate 33', () => {
  const T: Type.TNumber = Type.Evaluate(Type.Union([Type.Number(), Type.Literal(1)]))
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Evaluate 34', () => {
  const T: Type.TUnion<[Type.TNumber, Type.TString]> = Type.Evaluate(Type.Union([Type.Literal(1), Type.Number(), Type.String()]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Evaluate 35', () => {
  const T: Type.TUnion<[Type.TString, Type.TNumber]> = Type.Evaluate(Type.Union([Type.String(), Type.Number(), Type.Literal(1)]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Evaluate 36', () => {
  const T: Type.TUnion<[Type.TBoolean, Type.TNumber, Type.TString]> = Type.Evaluate(Type.Union([Type.Boolean(), Type.Number(), Type.String()]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
  Assert.IsTrue(Type.IsString(T.anyOf[2]))
})
Test('Should Evaluate 37', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Evaluate(Type.Union([
    Type.Tuple([Type.Literal(1), Type.Literal(2), Type.Literal(3)]),
    Type.Tuple([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  ]))
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 3)
})
// ------------------------------------------------------------------
// Evaluate: Union
// ------------------------------------------------------------------
Test('Should Evaluate 38', () => {
  const T: Type.TUnion<[
    Type.TObject<{
      x: Type.TLiteral<1>
      y: Type.TLiteral<2>
    }>,
    Type.TObject<{
      x: Type.TLiteral<1>
      z: Type.TLiteral<3>
    }>
  ]> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Literal(1) }),
    Type.Union([
      Type.Object({ y: Type.Literal(2) }),
      Type.Object({ z: Type.Literal(3) })
    ])
  ]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsEqual(T.anyOf[0].properties.x.const, 1)
  Assert.IsEqual(T.anyOf[0].properties.y.const, 2)
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsEqual(T.anyOf[1].properties.x.const, 1)
  Assert.IsEqual(T.anyOf[1].properties.z.const, 3)
})
Test('Should Evaluate 39', () => {
  const T: Type.TUnion<[
    Type.TObject<{
      x: Type.TLiteral<1>
      y: Type.TLiteral<2>
    }>,
    Type.TObject<{
      x: Type.TLiteral<1>
      z: Type.TLiteral<3>
    }>
  ]> = Type.Evaluate(Type.Intersect([
    Type.Union([
      Type.Object({ y: Type.Literal(2) }),
      Type.Object({ z: Type.Literal(3) })
    ]),
    Type.Object({ x: Type.Literal(1) })
  ]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsEqual(T.anyOf[0].properties.x.const, 1)
  Assert.IsEqual(T.anyOf[0].properties.y.const, 2)
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsEqual(T.anyOf[1].properties.x.const, 1)
  Assert.IsEqual(T.anyOf[1].properties.z.const, 3)
})
Test('Should Evaluate 40', () => {
  const T: Type.TUnion<[
    Type.TObject<{
      x: Type.TLiteral<1>
      z: Type.TLiteral<3>
    }>,
    Type.TObject<{
      y: Type.TLiteral<2>
      z: Type.TLiteral<3>
    }>,
    Type.TObject<{
      x: Type.TLiteral<1>
      w: Type.TLiteral<4>
    }>,
    Type.TObject<{
      y: Type.TLiteral<2>
      w: Type.TLiteral<4>
    }>
  ]> = Type.Evaluate(Type.Intersect([
    Type.Union([
      Type.Object({ x: Type.Literal(1) }),
      Type.Object({ y: Type.Literal(2) })
    ]),
    Type.Union([
      Type.Object({ z: Type.Literal(3) }),
      Type.Object({ w: Type.Literal(4) })
    ])
  ]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsEqual(T.anyOf[0].properties.x.const, 1)
  Assert.IsEqual(T.anyOf[0].properties.z.const, 3)

  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsEqual(T.anyOf[1].properties.y.const, 2)
  Assert.IsEqual(T.anyOf[1].properties.z.const, 3)

  Assert.IsTrue(Type.IsObject(T.anyOf[2]))
  Assert.IsEqual(T.anyOf[2].properties.x.const, 1)
  Assert.IsEqual(T.anyOf[2].properties.w.const, 4)

  Assert.IsTrue(Type.IsObject(T.anyOf[3]))
  Assert.IsEqual(T.anyOf[3].properties.y.const, 2)
  Assert.IsEqual(T.anyOf[3].properties.w.const, 4)
})
// ------------------------------------------------------------------
// Evaluate: Nested Intersect Composite
// ------------------------------------------------------------------
Test('Should Evaluate 41', () => {
  const T: Type.TObject<{ x: Type.TNumber }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Number() })]),
    Type.Intersect([Type.Number()])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 42', () => {
  const T: Type.TObject<{ x: Type.TNumber; y: Type.TNumber }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Number() })]),
    Type.Intersect([Type.Object({ y: Type.Number() })]),
    Type.Intersect([Type.Number()])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
})
Test('Should Evaluate 43', () => {
  const T: Type.TObject<{ x: Type.TNumber; y: Type.TNumber }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Number()]),
    Type.Intersect([Type.Object({ x: Type.Number() })]),
    Type.Intersect([Type.Object({ y: Type.Number() })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
})
Test('Should Evaluate 44', () => {
  const T: Type.TObject<{ x: Type.TNumber }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Number() })]),
    Type.Intersect([Type.Array(Type.Number())])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})

// ------------------------------------------------------------------
// Evaluate: Nested Intersect + Modifier
// ------------------------------------------------------------------
Test('Should Evaluate 45', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Optional(Type.Number()) })]),
    Type.Intersect([Type.Object({ x: Type.Number() })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 46', () => {
  const T: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Optional(Type.Number()) })]),
    Type.Intersect([Type.Object({ x: Type.Optional(Type.Number()) })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 47', () => {
  const T: Type.TObject<{
    x: Type.TOptional<Type.TLiteral<1>>
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Optional(Type.Literal(1)) })]),
    Type.Intersect([Type.Object({ x: Type.Optional(Type.Number()) })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 48', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Optional(Type.Literal(1)) })]),
    Type.Intersect([Type.Object({ x: Type.Number() })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 49', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Number() })]),
    Type.Intersect([Type.Object({ x: Type.Optional(Type.Literal(1)) })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
})
Test('Should Evaluate 50', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Readonly(Type.Number()) })]),
    Type.Intersect([Type.Object({ x: Type.Number() })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
})
Test('Should Evaluate 51', () => {
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Readonly(Type.Number()) })]),
    Type.Intersect([Type.Object({ x: Type.Readonly(Type.Number()) })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
})
Test('Should Evaluate 52', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Readonly(Type.Literal(1)) })]),
    Type.Intersect([Type.Object({ x: Type.Number() })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
})
Test('Should Evaluate 53', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Number() })]),
    Type.Intersect([Type.Object({ x: Type.Readonly(Type.Literal(1)) })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
})
Test('Should Evaluate 54', () => {
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TLiteral<1>>
  }> = Type.Evaluate(Type.Intersect([
    Type.Intersect([Type.Object({ x: Type.Readonly(Type.Literal(1)) })]),
    Type.Intersect([Type.Object({ x: Type.Readonly(Type.Number()) })])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
})
// ------------------------------------------------------------------
// Evaluate: Coverage
// ------------------------------------------------------------------
Test('Should Evaluate 55', () => {
  const T: Type.TUnion<[
    Type.TObject<{
      x: Type.TLiteral<1>
    }>,
    Type.TObject<{
      x: Type.TLiteral<1>
    }>
  ]> = Type.Evaluate(Type.Union([
    Type.Object({ x: Type.Literal(1) }),
    Type.Object({ x: Type.Literal(1) })
  ]))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsEqual(T.anyOf[0].properties.x.const, 1)
  Assert.IsEqual(T.anyOf[1].properties.x.const, 1)
})
Test('Should Evaluate 56', () => {
  const T: Type.TObject<{
    0: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ 0: Type.Literal(1) }),
    Type.Tuple([Type.Literal(1)])
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.properties[0].const, 1)
})
Test('Should Evaluate 57', () => {
  const T: Type.TObject<{
    0: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Tuple([Type.Literal(1)]),
    Type.Object({ 0: Type.Literal(1) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.properties[0].const, 1)
})
Test('Should Evaluate 58', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Literal(1) }),
    Type.Object({ x: Type.Literal(1) }),
    Type.Object({ x: Type.Literal(1) }),
    Type.Object({ x: Type.Literal(1) }),
    Type.Object({ x: Type.Literal(1) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.properties.x.const, 1)
})
// ------------------------------------------------------------------
// TCompare<Left, Right>: Unknown Left Rule
// ------------------------------------------------------------------
Test('Should Evaluate 59', () => {
  const T: Type.TUnknown = Type.Evaluate(Type.Intersect([Type.Unknown(), Type.Unknown()]))
  Assert.IsTrue(Type.IsUnknown(T))
})
Test('Should Evaluate 60', () => {
  const T: Type.TNever = Type.Evaluate(Type.Intersect([Type.Unknown(), Type.Never()]))
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 61', () => {
  const T: Type.TUnknown = Type.Evaluate(Type.Intersect([Type.Unknown(), Type.Any()]))
  Assert.IsTrue(Type.IsUnknown(T))
})
Test('Should Evaluate 62', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([Type.Unknown(), Type.Object({ x: Type.Number() })]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
// ------------------------------------------------------------------
// Composite: Overlapping Property Modifier Rules
// ------------------------------------------------------------------
Test('Should Evaluate 62', () => {
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Optional(Type.Readonly(Type.Number())) }),
    Type.Object({ x: Type.Optional(Type.Readonly(Type.Number())) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 62', () => {
  const T: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Optional(Type.Number()) }),
    Type.Object({ x: Type.Optional(Type.Number()) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 62', () => {
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Readonly(Type.Number()) }),
    Type.Object({ x: Type.Readonly(Type.Number()) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 62', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Optional(Type.Number()) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 62', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Optional(Type.Number()) }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 62', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Optional(Type.Number()) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 62', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Readonly(Type.Number()) })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Evaluate 62', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Evaluate(Type.Intersect([
    Type.Object({ x: Type.Readonly(Type.Number()) }),
    Type.Object({ x: Type.Number() })
  ]))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
// ------------------------------------------------------------------
// Base
//
// https://github.com/sinclairzx81/typebox/issues/1449
//
// ------------------------------------------------------------------
class Foo extends Type.Base {
  public override Check(value: unknown): value is unknown {
    return true
  }
  public override Errors(value: unknown): object[] {
    return []
  }
  public override Clone(): Foo {
    return new Foo()
  }
}
Test('Should Evaluate 63', () => {
  const T = Type.Evaluate(Type.Object({ value: Type.Optional(new Foo()) }))
  Assert.IsTrue(Type.IsOptional(T.properties.value))
  Assert.IsTrue(Type.IsBase(T.properties.value))
  Assert.IsTrue(T.properties.value instanceof Foo)
})
Test('Should Evaluate 64', () => {
  const T = Type.Evaluate(Type.Intersect([
    Type.Object({ value: Type.Optional(new Foo()) }),
    Type.Object({ value: Type.Optional(new Foo()) })
  ]))
  Assert.IsTrue(Type.IsOptional(T.properties.value))
  Assert.IsTrue(Type.IsNever(T.properties.value))
})
Test('Should Evaluate 65', () => {
  const T = Type.Evaluate(Type.Intersect([
    Type.Object({ value: new Foo() }),
    Type.Object({ value: new Foo() })
  ]))
  Assert.IsFalse(Type.IsOptional(T.properties.value))
  Assert.IsTrue(Type.IsNever(T.properties.value))
})
Test('Should Evaluate 66', () => {
  const T = Type.Evaluate(Type.Intersect([
    Type.Object({ value: Type.Optional(new Foo()) }),
    Type.Object({})
  ]))
  Assert.IsTrue(Type.IsOptional(T.properties.value))
  Assert.IsTrue(Type.IsBase(T.properties.value))
  Assert.IsTrue(T.properties.value instanceof Foo)
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1506
// ------------------------------------------------------------------
Test('Should Evaluate 67', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ c: Type.Number() }),
      Type.Union([
        Type.Object({ a: Type.Number() }),
        Type.Object({ b: Type.Number() })
      ])
    ]),
    Type.Object({ x: Type.Number() })
  ])
  const S: Type.TUnion<[
    Type.TObject<{
      x: Type.TNumber
      c: Type.TNumber
      a: Type.TNumber
    }>,
    Type.TObject<{
      x: Type.TNumber
      c: Type.TNumber
      b: Type.TNumber
    }>
  ]> = Type.Evaluate(T)
  Assert.IsTrue(Type.IsUnion(S))
  Assert.IsTrue(Type.IsObject(S.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(S.anyOf[0].properties.a))
  Assert.IsTrue(Type.IsNumber(S.anyOf[0].properties.c))
  Assert.IsTrue(Type.IsNumber(S.anyOf[0].properties.x))
  Assert.IsTrue(Type.IsObject(S.anyOf[1]))
  Assert.IsTrue(Type.IsNumber(S.anyOf[1].properties.b))
  Assert.IsTrue(Type.IsNumber(S.anyOf[1].properties.c))
  Assert.IsTrue(Type.IsNumber(S.anyOf[1].properties.x))
})
// ------------------------------------------------------------------
// Dependent
// ------------------------------------------------------------------
Test('Should Evaluate 65', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TString]> = Type.Evaluate(Type.Dependent(Type.Number(), Type.Literal(1), Type.String()))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsLiteral(T.anyOf[0]))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Evaluate 66', () => {
  const T: Type.TLiteral<1> = Type.Evaluate(Type.Dependent(Type.Number(), Type.Literal(1), Type.Literal(2)))
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Evaluate 67', () => {
  const T: Type.TNever = Type.Evaluate(Type.Dependent(Type.Number(), Type.String(), Type.Literal(2)))
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 68', () => {
  const T: Type.TUnknown = Type.Evaluate(Type.Dependent(Type.Number(), Type.String(), Type.Unknown()))
  Assert.IsTrue(Type.IsUnknown(T))
})
Test('Should Evaluate 69', () => {
  const T: Type.TNumber = Type.Evaluate(Type.Dependent(Type.Number(), Type.Unknown(), Type.Literal(1)))
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Evaluate 70', () => {
  const T: Type.TNever = Type.Evaluate(Type.Dependent(Type.Number(), Type.Never(), Type.Literal(1)))
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 71', () => {
  const T: Type.TLiteral<'hello'> = Type.Evaluate(Type.Dependent(Type.Number(), Type.Never(), Type.Literal('hello')))
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 'hello')
})
Test('Should Evaluate 72', () => {
  const T: Type.TObject<{ a: Type.TNumber; b: Type.TString }> = Type.Evaluate(
    Type.Dependent(Type.Object({ a: Type.Number() }), Type.Object({ b: Type.String() }), Type.Never())
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.a))
  Assert.IsTrue(Type.IsString(T.properties.b))
})
Test('Should Evaluate 73', () => {
  const T: Type.TUnion<[Type.TObject<{ a: Type.TNumber }>, Type.TString]> = Type.Evaluate(
    Type.Dependent(Type.Object({ a: Type.Number() }), Type.Never(), Type.String())
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.a))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Evaluate 74', () => {
  const T: Type.TObject<{ a: Type.TNumber }> = Type.Evaluate(
    Type.Dependent(Type.Object({ a: Type.Number() }), Type.Unknown(), Type.Never())
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.a))
})
Test('Should Evaluate 75', () => {
  const T: Type.TUnion<[Type.TObject<{ a: Type.TNumber; b: Type.TString }>, Type.TNumber]> = Type.Evaluate(
    Type.Dependent(Type.Object({ a: Type.Number() }), Type.Object({ b: Type.String() }), Type.Number())
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.a))
  Assert.IsTrue(Type.IsString(T.anyOf[0].properties.b))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Evaluate 76', () => {
  const T: Type.TObject<{ 0: Type.TNever }> = Type.Evaluate(
    Type.Dependent(Type.Tuple([Type.Number()]), Type.Tuple([Type.String()]), Type.Never())
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNever(T.properties[0]))
})
Test('Should Evaluate 77', () => {
  const T: Type.TUnion<[Type.TTuple<[Type.TNumber]>, Type.TString]> = Type.Evaluate(
    Type.Dependent(Type.Tuple([Type.Number()]), Type.Never(), Type.String())
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsTuple(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].items![0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Evaluate 78', () => {
  const T: Type.TTuple<[Type.TNumber, Type.TString]> = Type.Evaluate(
    Type.Dependent(Type.Tuple([Type.Number(), Type.String()]), Type.Unknown(), Type.Never())
  )
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsNumber(T.items![0]))
  Assert.IsTrue(Type.IsString(T.items![1]))
})
Test('Should Evaluate 79', () => {
  const T: Type.TUnion<[Type.TObject<{ 0: Type.TNever }>, Type.TNumber]> = Type.Evaluate(
    Type.Dependent(Type.Tuple([Type.Number()]), Type.Tuple([Type.String()]), Type.Number())
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsNever(T.anyOf[0].properties[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Evaluate 80', () => {
  const T: Type.TTuple<[Type.TNumber]> = Type.Evaluate(
    Type.Dependent(Type.Tuple([Type.Number()]), Type.Literal(1), Type.Never())
  )
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsNumber(T.items![0]))
})
Test('Should Evaluate 81', () => {
  const T: Type.TLiteral<1> = Type.Evaluate(
    Type.Dependent(Type.Union([Type.Number(), Type.String()]), Type.Literal(1), Type.Never())
  )
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Evaluate 82', () => {
  const T: Type.TNever = Type.Evaluate(
    Type.Dependent(Type.Union([Type.Number(), Type.String()]), Type.Never(), Type.Literal(1))
  )
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 83', () => {
  const T: Type.TUnion<[Type.TNumber, Type.TString]> = Type.Evaluate(
    Type.Dependent(Type.Union([Type.Number(), Type.String()]), Type.Unknown(), Type.Never())
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Evaluate 84', () => {
  const T: Type.TUnion<[Type.TNumber, Type.TString, Type.TBoolean]> = Type.Evaluate(
    Type.Dependent(Type.Union([Type.Number(), Type.String()]), Type.Unknown(), Type.Boolean())
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[2]))
})
Test('Should Evaluate 85', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]> = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Union([Type.Literal(1), Type.Literal(2)]), Type.Never())
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsLiteral(T.anyOf[0]))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsTrue(Type.IsLiteral(T.anyOf[1]))
  Assert.IsEqual(T.anyOf[1].const, 2)
})
Test('Should Evaluate 86', () => {
  const T: Type.TNever = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Union([Type.String(), Type.Boolean()]), Type.Literal(1))
  )
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 87', () => {
  const T: Type.TNull = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Union([Type.String(), Type.Boolean()]), Type.Null())
  )
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Evaluate 88', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TBoolean]> = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Union([Type.Literal(1), Type.String()]), Type.Boolean())
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsLiteral(T.anyOf[0]))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsTrue(Type.IsBoolean(T.anyOf[1]))
})
Test('Should Evaluate 89', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TString, Type.TBoolean]> = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Literal(1), Type.Union([Type.String(), Type.Boolean()]))
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsLiteral(T.anyOf[0]))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[2]))
})
Test('Should Evaluate 90', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TString]> = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Literal(1), Type.Union([Type.Number(), Type.String()]))
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsLiteral(T.anyOf[0]))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Evaluate 91', () => {
  const T: Type.TUnion<[Type.TLiteral<'a'>, Type.TNumber, Type.TBoolean]> = Type.Evaluate(
    Type.Dependent(Type.String(), Type.Literal('a'), Type.Union([Type.Number(), Type.Boolean()]))
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsLiteral(T.anyOf[0]))
  Assert.IsEqual(T.anyOf[0].const, 'a')
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[2]))
})
Test('Should Evaluate 92', () => {
  const T: Type.TNever = Type.Evaluate(
    Type.Dependent(Type.Intersect([Type.Number(), Type.String()]), Type.Literal(1), Type.Never())
  )
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 93', () => {
  const T: Type.TBoolean = Type.Evaluate(
    Type.Dependent(Type.Intersect([Type.Number(), Type.String()]), Type.Never(), Type.Boolean())
  )
  Assert.IsTrue(Type.IsBoolean(T))
})
Test('Should Evaluate 94', () => {
  const T: Type.TNever = Type.Evaluate(
    Type.Dependent(Type.Intersect([Type.Number(), Type.String()]), Type.Unknown(), Type.Never())
  )
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 95', () => {
  const T: Type.TNever = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Intersect([Type.String(), Type.Boolean()]), Type.Never())
  )
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 96', () => {
  const T: Type.TNever = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Intersect([Type.String(), Type.Boolean()]), Type.Literal(1))
  )
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Evaluate 97', () => {
  const T: Type.TBoolean = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Intersect([Type.Literal(1), Type.Literal(2)]), Type.Boolean())
  )
  Assert.IsTrue(Type.IsBoolean(T))
})
Test('Should Evaluate 98', () => {
  const T: Type.TLiteral<1> = Type.Evaluate(
    Type.Dependent(Type.Number(), Type.Literal(1), Type.Intersect([Type.String(), Type.Boolean()]))
  )
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Evaluate 99', () => {
  const T: Type.TString = Type.Evaluate(
    Type.Dependent(Type.String(), Type.Unknown(), Type.Intersect([Type.Number(), Type.Boolean()]))
  )
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Evaluate 100', () => {
  const T: Type.TObject<{ a: Type.TNumber; 0: Type.TString }> = Type.Evaluate(
    Type.Dependent(Type.Object({ a: Type.Number() }), Type.Tuple([Type.String()]), Type.Never())
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.a))
  Assert.IsTrue(Type.IsString(T.properties[0]))
})
Test('Should Evaluate 101', () => {
  const T: Type.TObject<{ 0: Type.TNumber; b: Type.TString }> = Type.Evaluate(
    Type.Dependent(Type.Tuple([Type.Number()]), Type.Object({ b: Type.String() }), Type.Never())
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties[0]))
  Assert.IsTrue(Type.IsString(T.properties.b))
})
Test('Should Evaluate 102', () => {
  const T: Type.TUnion<[Type.TObject<{ a: Type.TNumber }>, Type.TTuple<[Type.TNumber, Type.TString]>]> = Type.Evaluate(
    Type.Dependent(Type.Object({ a: Type.Number() }), Type.Never(), Type.Tuple([Type.Number(), Type.String()]))
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.a))
  Assert.IsTrue(Type.IsTuple(T.anyOf[1]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1].items![0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1].items![1]))
})
Test('Should Evaluate 103', () => {
  const T: Type.TUnion<[Type.TTuple<[Type.TNumber]>, Type.TObject<{ x: Type.TBoolean }>]> = Type.Evaluate(
    Type.Dependent(Type.Tuple([Type.Number()]), Type.Never(), Type.Object({ x: Type.Boolean() }))
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsTuple(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].items![0]))
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[1].properties.x))
})
Test('Should Evaluate 104', () => {
  const T: Type.TUnion<[Type.TObject<{ x: Type.TNumber; y: Type.TNumber }>, Type.TObject<{ x: Type.TNumber; z: Type.TNumber }>]> = Type.Evaluate(
    Type.Dependent(
      Type.Object({ x: Type.Number() }),
      Type.Union([
        Type.Object({ y: Type.Number() }),
        Type.Object({ z: Type.Number() })
      ]),
      Type.Never()
    )
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.x))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.y))
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1].properties.x))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1].properties.z))
})
Test('Should Evaluate 105', () => {
  const T: Type.TUnion<[Type.TObject<{ x: Type.TNumber; y: Type.TNumber }>, Type.TObject<{ x: Type.TNumber; z: Type.TNumber }>, Type.TBoolean]> = Type.Evaluate(
    Type.Dependent(
      Type.Object({ x: Type.Number() }),
      Type.Union([
        Type.Object({ y: Type.Number() }),
        Type.Object({ z: Type.Number() })
      ]),
      Type.Boolean()
    )
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.x))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.y))
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1].properties.x))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1].properties.z))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[2]))
})
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
Test('Should Evaluate 106', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<'hello'>]> = Type.Evaluate(Type.Enum([1, 'hello']))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 'hello')
})
Test('Should Evaluate 107', () => {
  const T: Type.TLiteral<1> = Type.Evaluate(Type.Enum([1, 1, 1]))
  Assert.IsEqual(T.const, 1)
})
// ------------------------------------------------------------------
// TemplateLiteral
// ------------------------------------------------------------------
Test('Should Evaluate 108', () => {
  const T: Type.TUnion<[Type.TLiteral<'hello1'>, Type.TLiteral<'hello2'>]> = Type.Evaluate(Type.TemplateLiteral('hello${1|2}'))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'hello1')
  Assert.IsEqual(T.anyOf[1].const, 'hello2')
})
Test('Should Evaluate 109', () => {
  const T: Type.TString = Type.Evaluate(Type.TemplateLiteral('hello${string}'))
  Assert.IsTrue(Type.IsString(T))
})
// ------------------------------------------------------------------
// With
// ------------------------------------------------------------------
Test('Should Evaluate 110', () => {
  const A: Type.TWith<
    Type.TObject<{
      a: Type.TNumber
      b: Type.TNumber
    }>,
    {
      readonly foo: 1
    }
  > = Type.With(Type.Object({ a: Type.Number(), b: Type.Number() }), { foo: 1 })

  const B: Type.TWith<
    Type.TObject<{
      c: Type.TNumber
      d: Type.TNumber
    }>,
    {
      readonly bar: 1
    }
  > = Type.With(Type.Object({ c: Type.Number(), d: Type.Number() }), { bar: 1 })

  const C: Type.TWith<
    Type.TObject<{
      a: Type.TNumber
      b: Type.TNumber
      c: Type.TNumber
      d: Type.TNumber
    }>,
    {
      readonly baz: 1
    }
  > = Type.With(Type.Evaluate(Type.Intersect([A, B])), { baz: 1 })

  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.a))
  Assert.IsTrue(Type.IsNumber(A.properties.b))
  Assert.HasPropertyKey(A, 'foo')
  Assert.IsEqual(A.foo, 1)

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsTrue(Type.IsNumber(B.properties.c))
  Assert.IsTrue(Type.IsNumber(B.properties.d))
  Assert.HasPropertyKey(B, 'bar')
  Assert.IsEqual(B.bar, 1)

  Assert.IsTrue(Type.IsObject(C))
  Assert.IsTrue(Type.IsNumber(C.properties.a))
  Assert.IsTrue(Type.IsNumber(C.properties.b))
  Assert.IsTrue(Type.IsNumber(C.properties.c))
  Assert.IsTrue(Type.IsNumber(C.properties.d))
  Assert.NotHasPropertyKey(C, 'foo')
  Assert.NotHasPropertyKey(C, 'bar')
  Assert.HasPropertyKey(C, 'baz')
  Assert.IsEqual(C.baz, 1)
})

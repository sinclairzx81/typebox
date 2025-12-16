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

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Conditional')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Conditional 1', () => {
  const T: Type.TRef<'A'> = Type.Conditional(
    Type.Number(),
    Type.Number(),
    Type.Ref('A'),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsRef(T))
})
Test('Should Conditional 2', () => {
  const T: Type.TRef<'A'> = Type.Conditional(
    Type.Number(),
    Type.String(),
    Type.Literal(true),
    Type.Ref('A')
  )
  Assert.IsTrue(Type.IsRef(T))
})

Test('Should Conditional 3', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Null(),
    Type.Number(),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 4', () => {
  const T: Type.TDeferred<'Conditional', [
    Type.TRef<'A'>,
    Type.TNumber,
    Type.TLiteral<true>,
    Type.TLiteral<false>
  ]> = Type.Conditional(
    Type.Ref('A'),
    Type.Number(),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsTrue(Type.IsNumber(T.parameters[1]))
  Assert.IsTrue(Type.IsLiteral(T.parameters[2]))
  Assert.IsTrue(Type.IsLiteral(T.parameters[3]))
  Assert.IsEqual(T.parameters[2].const, true)
  Assert.IsEqual(T.parameters[3].const, false)
})
Test('Should Conditional 5', () => {
  const T: Type.TDeferred<'Conditional', [
    Type.TNumber,
    Type.TRef<'A'>,
    Type.TLiteral<true>,
    Type.TLiteral<false>
  ]> = Type.Conditional(
    Type.Number(),
    Type.Ref('A'),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsNumber(T.parameters[0]))
  Assert.IsTrue(Type.IsRef(T.parameters[1]))
  Assert.IsTrue(Type.IsLiteral(T.parameters[2]))
  Assert.IsTrue(Type.IsLiteral(T.parameters[3]))
  Assert.IsEqual(T.parameters[2].const, true)
  Assert.IsEqual(T.parameters[3].const, false)
})
Test('Should Conditional 6', () => {
  const T: Type.TDeferred<'Conditional', [
    Type.TRef<'A'>,
    Type.TRef<'B'>,
    Type.TLiteral<true>,
    Type.TLiteral<false>
  ]> = Type.Conditional(
    Type.Ref('A'),
    Type.Ref('B'),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsTrue(Type.IsRef(T.parameters[1]))
  Assert.IsTrue(Type.IsLiteral(T.parameters[2]))
  Assert.IsTrue(Type.IsLiteral(T.parameters[3]))
  Assert.IsEqual(T.parameters[2].const, true)
  Assert.IsEqual(T.parameters[3].const, false)
})
// ------------------------------------------------------------------
// Simple
// ------------------------------------------------------------------
Test('Should Conditional 7', () => {
  const T: Type.TLiteral<true> = Type.Conditional(
    Type.Null(),
    Type.Null(),
    Type.Literal(true),
    Type.Literal(false)
  )
})
Test('Should Conditional and Guard (True)', () => {
  const T: Type.TLiteral<true> = Type.Conditional(
    Type.Null(),
    Type.Null(),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, true)
})
// ------------------------------------------------------------------
// Structural: Object
// ------------------------------------------------------------------
Test('Should Conditional 8', () => {
  const T: Type.TLiteral<true> = Type.Conditional(
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, true)
})
Test('Should Conditional 8', () => {
  const T: Type.TLiteral<true> = Type.Conditional(
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    }),
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, true)
})
Test('Should Conditional 9', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    }),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 10', () => {
  const T: Type.TLiteral<true> = Type.Conditional(
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Object({
        x: Type.Number()
      })
    }),
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Object({
        x: Type.Number()
      })
    }),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, true)
})
Test('Should Conditional 11', () => {
  const T: Type.TLiteral<true> = Type.Conditional(
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Object({
        x: Type.Number()
      })
    }),
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Object({
        x: Type.Number()
      })
    }),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, true)
})
Test('Should Conditional 12', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Object({
      x: Type.Number(),
      y: Type.String()
    }),
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 13', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    Type.Object({
      x: Type.Number(),
      y: Type.String()
    }),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 14', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Object({
        x: Type.String()
      })
    }),
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Object({
        x: Type.Number()
      })
    }),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 15', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Object({
        x: Type.Number()
      })
    }),
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Object({
        x: Type.String()
      })
    }),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
// ------------------------------------------------------------------
// Structural: Union
// ------------------------------------------------------------------
Test('Should Conditional 16', () => {
  const T: Type.TLiteral<true> = Type.Conditional(
    Type.Union([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Union([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, true)
})
Test('Should Conditional 17', () => {
  const T: Type.TLiteral<true> = Type.Conditional(
    Type.Union([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Union([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3)
    ]),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, true)
})
Test('Should Conditional 18', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Union([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3)
    ]),
    Type.Union([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
// ------------------------------------------------------------------
// Structural: Tuple
// ------------------------------------------------------------------
Test('Should Conditional 19', () => {
  const T: Type.TLiteral<true> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, true)
})
Test('Should Conditional 20', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3)
    ]),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 21', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3)
    ]),
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 22', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.String()
    ]),
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 23', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Tuple([
      Type.Literal(1),
      Type.String()
    ]),
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
// ------------------------------------------------------------------
// Structural: Intersect | Union
// ------------------------------------------------------------------
Test('Should Conditional 24', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Number() })
    ])
  ])
  const B = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Number() })
    ])
  ])
  const T: Type.TLiteral<true> = Type.Conditional(
    A,
    B,
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, true)
})
Test('Should Conditional 25', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Number() })
    ])
  ])
  const B = Type.Evaluate(A)
  const T: Type.TLiteral<true> = Type.Conditional(
    A,
    B,
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, true)
})
Test('Should Conditional 26', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.String() })
    ])
  ])
  const B = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Number() })
    ])
  ])
  const T: Type.TLiteral<false> = Type.Conditional(
    A,
    B,
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 27', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.Number() })
    ])
  ])
  const B = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Union([
      Type.Object({ y: Type.Number() }),
      Type.Object({ z: Type.String() })
    ])
  ])
  const T: Type.TLiteral<false> = Type.Conditional(
    A,
    B,
    Type.Literal(true),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
Test('Should Conditional 28', () => {
  const T: Type.TString = Type.Conditional(
    Type.String(),
    Type.Infer('A'),
    Type.Ref('A'),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Conditional 29', () => {
  const T: Type.TString = Type.Conditional(
    Type.String(),
    Type.Infer('A', Type.String()),
    Type.Ref('A'),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Conditional 30', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.String(),
    Type.Infer('A', Type.Number()),
    Type.Ref('A'),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 31', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Tuple([Type.Number()]),
    Type.Infer('A', Type.String()),
    Type.Ref('A'),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 32', () => {
  const T: Type.TLiteral<false> = Type.Conditional(
    Type.Tuple([Type.Number()]),
    Type.Tuple([Type.Infer('A', Type.String())]),
    Type.Ref('A'),
    Type.Literal(false)
  )
  Assert.IsEqual(T.const, false)
})
Test('Should Conditional 33', () => {
  const T: Type.TNumber = Type.Conditional(
    Type.Tuple([Type.Number()]),
    Type.Tuple([Type.Infer('A', Type.Number())]),
    Type.Ref('A'),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Conditional 34', () => {
  const T: Type.TTuple<[
    Type.TLiteral<1>,
    Type.TLiteral<2>
  ]> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Infer('A'),
    Type.Ref('A'),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsLiteral(T.items[0]))
  Assert.IsTrue(Type.IsLiteral(T.items[1]))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
})
Test('Should Conditional 35', () => {
  const T: Type.TTuple<[
    Type.TLiteral<2>,
    Type.TLiteral<1>
  ]> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Tuple([
      Type.Infer('A'),
      Type.Infer('B')
    ]),
    Type.Tuple([
      Type.Ref('B'),
      Type.Ref('A')
    ]),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsLiteral(T.items[0]))
  Assert.IsTrue(Type.IsLiteral(T.items[1]))
  Assert.IsEqual(T.items[0].const, 2)
  Assert.IsEqual(T.items[1].const, 1)
})
Test('Should Conditional 36', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<1>
    y: Type.TLiteral<2>
  }> = Type.Conditional(
    Type.Object({
      x: Type.Literal(1),
      y: Type.Literal(2)
    }),
    Type.Infer('A'),
    Type.Ref('A'),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsTrue(Type.IsLiteral(T.properties.y))
  Assert.IsEqual(T.properties.x.const, 1)
  Assert.IsEqual(T.properties.y.const, 2)
})
Test('Should Conditional 37', () => {
  const T: Type.TObject<{
    x: Type.TLiteral<2>
    y: Type.TLiteral<1>
  }> = Type.Conditional(
    Type.Object({
      x: Type.Literal(1),
      y: Type.Literal(2)
    }),
    Type.Object({
      x: Type.Infer('A'),
      y: Type.Infer('B')
    }),
    Type.Object({
      x: Type.Ref('B'),
      y: Type.Ref('A')
    }),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsLiteral(T.properties.x))
  Assert.IsTrue(Type.IsLiteral(T.properties.y))
  Assert.IsEqual(T.properties.x.const, 2)
  Assert.IsEqual(T.properties.y.const, 1)
})
Test('Should Conditional 38', () => {
  const T: Type.TTuple<[
    Type.TLiteral<1>,
    Type.TTuple<[
      Type.TLiteral<2>,
      Type.TLiteral<3>
    ]>
  ]> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3)
    ]),
    Type.Tuple([
      Type.Infer('A'),
      Type.Rest(Type.Infer('B'))
    ]),
    Type.Tuple([
      Type.Ref('A'),
      Type.Ref('B')
    ]),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsTuple(T.items[1]))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].items[0].const, 2)
  Assert.IsEqual(T.items[1].items[1].const, 3)
})
Test('Should Conditional 39', () => {
  const T: Type.TTuple<[
    Type.TLiteral<1>,
    Type.TLiteral<2>,
    Type.TLiteral<3>
  ]> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3)
    ]),
    Type.Tuple([
      Type.Infer('A'),
      Type.Rest(Type.Infer('B'))
    ]),
    Type.Tuple([
      Type.Ref('A'),
      Type.Rest(Type.Ref('B'))
    ]),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 3)
})
Test('Should Conditional 40', () => {
  const T: Type.TTuple<[
    Type.TTuple<[
      Type.TLiteral<1>,
      Type.TLiteral<2>
    ]>,
    Type.TLiteral<3>
  ]> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3)
    ]),
    Type.Tuple([
      Type.Rest(Type.Infer('A')),
      Type.Infer('B')
    ]),
    Type.Tuple([
      Type.Ref('A'),
      Type.Ref('B')
    ]),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsTuple(T.items[0]))
  Assert.IsEqual(T.items[0].items[0].const, 1)
  Assert.IsEqual(T.items[0].items[1].const, 2)
  Assert.IsEqual(T.items[1].const, 3)
})
Test('Should Conditional 41', () => {
  const T: Type.TTuple<[
    Type.TLiteral<1>,
    Type.TLiteral<2>,
    Type.TLiteral<3>
  ]> = Type.Conditional(
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3)
    ]),
    Type.Tuple([
      Type.Rest(Type.Infer('A')),
      Type.Infer('B')
    ]),
    Type.Tuple([
      Type.Rest(Type.Ref('A')),
      Type.Ref('B')
    ]),
    Type.Literal(false)
  )
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 3)
})
Test('Should Conditional 42', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]> = Type.Conditional(
    Type.Any(),
    Type.String(),
    Type.Literal(1),
    Type.Literal(2)
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
})
Test('Should Conditional 43', () => {
  const T: Type.TLiteral<1> = Type.Conditional(
    Type.String(),
    Type.Any(),
    Type.Literal(1),
    Type.Literal(2)
  )
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})

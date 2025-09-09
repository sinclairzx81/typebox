import { Extends, ExtendsResult, Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Infer')

// ------------------------------------------------------------------
// Simple
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  const X = Extends({}, Type.String(), Type.Infer('A'))
  Assert.IsTrue(Type.IsString(X.inferred.A))
})
Test('Should Extends 1', () => {
  const X: Type.ExtendsResult.TExtendsFalse = Extends({}, Type.String(), Type.Infer('A', Type.Number()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(X))
})

// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
Test('Should Extends 2', () => {
  const X = Extends({}, Type.Object({ x: Type.Number() }), Type.Infer('A'))
  Assert.IsTrue(Type.IsObject(X.inferred.A))
  Assert.IsTrue(Type.IsNumber(X.inferred.A.properties.x))
})
Test('Should Extends 3', () => {
  const X = Extends({}, Type.Object({ x: Type.Number() }), Type.Object({ x: Type.Infer('A') }))
  Assert.IsTrue(Type.IsNumber(X.inferred.A))
})
Test('Should Extends 3', () => {
  const X: Type.ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Object({ x: Type.Number() }),
    Type.Object({
      x: Type.Infer('A', Type.Never())
    })
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(X))
})
Test('Should Extends 3', () => {
  const X: Type.ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Object({ x: Type.Number() }),
    Type.Object({
      y: Type.Infer('A', Type.Never())
    })
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(X))
})
Test('Should Extends 3', () => {
  const X: Type.ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Object({ x: Type.Number() }),
    Type.Object({
      x: Type.Infer('A', Type.Number()),
      y: Type.Infer('B', Type.Never())
    })
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(X))
})
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
Test('Should Extends 4', () => {
  const X = Extends({}, Type.Array(Type.String()), Type.Array(Type.Infer('A')))
  Assert.IsTrue(Type.IsString(X.inferred.A))
})
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
Test('Should Extends 5', () => {
  const X = Extends(
    {},
    Type.Tuple([
      Type.Number(),
      Type.String()
    ]),
    Type.Tuple([
      Type.Infer('A'),
      Type.Infer('B')
    ])
  )
  Assert.IsTrue(Type.IsNumber(X.inferred.A))
  Assert.IsTrue(Type.IsString(X.inferred.B))
})
Test('Should Extends 6', () => {
  const X = Extends(
    {},
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3),
      Type.Literal(4)
    ]),
    Type.Tuple([
      Type.Infer('A'),
      Type.Rest(Type.Infer('B'))
    ])
  )
  Assert.IsTrue(Type.IsLiteral(X.inferred.A))
  Assert.IsEqual(X.inferred.A.const, 1)

  Assert.IsTrue(Type.IsTuple(X.inferred.B))
  Assert.IsEqual(X.inferred.B.items[0].const, 2)
  Assert.IsEqual(X.inferred.B.items[1].const, 3)
  Assert.IsEqual(X.inferred.B.items[2].const, 4)
})
Test('Should Extends 7', () => {
  const X = Extends(
    {},
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(2),
      Type.Literal(3),
      Type.Literal(4)
    ]),
    Type.Tuple([
      Type.Rest(Type.Infer('A')),
      Type.Infer('B')
    ])
  )
  Assert.IsTrue(Type.IsTuple(X.inferred.A))
  Assert.IsEqual(X.inferred.A.items[0].const, 1)
  Assert.IsEqual(X.inferred.A.items[1].const, 2)
  Assert.IsEqual(X.inferred.A.items[2].const, 3)

  Assert.IsTrue(Type.IsLiteral(X.inferred.B))
  Assert.IsEqual(X.inferred.B.const, 4)
})
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
Test('Should Extends 8', () => {
  type _X = (a: 1, b: 2) => 3 extends (a: infer A, b: infer B) => infer C ? { A: A; B: B; C: C } : false
  const X = Extends({}, Type.Function([Type.Literal(1), Type.Literal(2)], Type.Literal(3)), Type.Function([Type.Infer('A'), Type.Infer('B')], Type.Infer('C')))
  Assert.IsEqual(X.inferred.A.const, 1)
  Assert.IsEqual(X.inferred.B.const, 2)
  Assert.IsEqual(X.inferred.C.const, 3)
})
Test('Should Extends 9', () => {
  type _X = (a: 1) => number extends (a: infer A) => number ? { A: A } : false
  const X = Extends({}, Type.Function([Type.Literal(1)], Type.Number()), Type.Function([Type.Infer('A')], Type.Number()))
  Assert.IsEqual(X.inferred.A.const, 1)
})
Test('Should Extends 10', () => {
  type _X = (a: number) => 1 extends (a: number) => infer A ? { A: A } : false
  const X = Extends({}, Type.Function([Type.Number()], Type.Literal(1)), Type.Function([Type.Number()], Type.Infer('A')))
  Assert.IsEqual(X.inferred.A.const, 1)
})
Test('Should Extends 11', () => {
  Assert.IsExtends<(x?: 1) => number, (x: 1) => number>(true) // ok: infer right possible because optional left is extends
  type _X = (x?: 1) => number extends (x: infer A) => number ? { A: A } : false

  const X = Extends({}, Type.Function([Type.Optional(Type.Literal(1))], Type.Number()), Type.Function([Type.Infer('A')], Type.Number()))
  Assert.IsEqual(X.inferred.A.const, 1)
})
Test('Should Extends 12', () => {
  Assert.IsExtends<(x: 1) => number, (x?: 1) => number>(false) // fail: infer right fail because optional right fails
  type _X = (x: 1) => number extends (x?: infer A) => number ? { A: A } : false

  const X: Type.ExtendsResult.TExtendsFalse = Extends({}, Type.Function([Type.Literal(1)], Type.Number()), Type.Function([Type.Optional(Type.Infer('A'))], Type.Number()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(X))
})
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
Test('Should Extends 13', () => {
  type _X = new (a: 1, b: 2) => 3 extends new (a: infer A, b: infer B) => infer C ? { A: A; B: B; C: C } : false
  const X = Extends({}, Type.Constructor([Type.Literal(1), Type.Literal(2)], Type.Literal(3)), Type.Constructor([Type.Infer('A'), Type.Infer('B')], Type.Infer('C')))
  Assert.IsEqual(X.inferred.A.const, 1)
  Assert.IsEqual(X.inferred.B.const, 2)
  Assert.IsEqual(X.inferred.C.const, 3)
})
Test('Should Extends 14', () => {
  type _X = new (a: 1) => number extends new (a: infer A) => number ? { A: A } : false
  const X = Extends({}, Type.Constructor([Type.Literal(1)], Type.Number()), Type.Constructor([Type.Infer('A')], Type.Number()))
  Assert.IsEqual(X.inferred.A.const, 1)
})
Test('Should Extends 15', () => {
  type _X = new (a: number) => 1 extends new (a: number) => infer A ? { A: A } : false
  const X = Extends({}, Type.Constructor([Type.Number()], Type.Literal(1)), Type.Constructor([Type.Number()], Type.Infer('A')))
  Assert.IsEqual(X.inferred.A.const, 1)
})
Test('Should Extends 16', () => {
  Assert.IsExtends<new (x?: 1) => number, new (x: 1) => number>(true) // ok: infer right possible because optional left is extends
  type _X = new (x?: 1) => number extends new (x: infer A) => number ? { A: A } : false

  const X = Extends({}, Type.Constructor([Type.Optional(Type.Literal(1))], Type.Number()), Type.Constructor([Type.Infer('A')], Type.Number()))
  Assert.IsEqual(X.inferred.A.const, 1)
})
Test('Should Extends 17', () => {
  Assert.IsExtends<new (x: 1) => number, new (x?: 1) => number>(false) // fail: infer right fail because optional right fails
  type _X = new (x: 1) => number extends new (x?: infer A) => number ? { A: A } : false

  const X: Type.ExtendsResult.TExtendsFalse = Extends({}, Type.Constructor([Type.Literal(1)], Type.Number()), Type.Constructor([Type.Optional(Type.Infer('A'))], Type.Number()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(X))
})

// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
Test('Should Extends 17', () => {
  const X = Extends({}, Type.String(), Type.Infer('A', Type.Union([Type.String(), Type.Number()])))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(X))
  Assert.IsEqual(X.inferred.A.type, 'string')
})
Test('Should Extends 18', () => {
  const X = Extends({}, Type.String(), Type.Infer('A', Type.Union([Type.Number(), Type.String()])))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(X))
  Assert.IsEqual(X.inferred.A.type, 'string')
})
Test('Should Extends 19', () => {
  const X: Type.ExtendsResult.TExtendsFalse = Extends({}, Type.Boolean(), Type.Infer('A', Type.Union([Type.Number(), Type.String()])))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(X))
})
Test('Should Extends 20', () => {
  const X = Extends({}, Type.Tuple([Type.String()]), Type.Tuple([Type.Infer('A', Type.Union([Type.String(), Type.Number()]))]))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(X))
  Assert.IsEqual(X.inferred.A.type, 'string')
})
Test('Should Extends 21', () => {
  const X = Extends({}, Type.Array(Type.String()), Type.Array(Type.Infer('A', Type.Union([Type.String(), Type.Number()]))))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(X))
  Assert.IsEqual(X.inferred.A.type, 'string')
})
Test('Should Extends 22', () => {
  type _X = [string, number] extends (infer A)[] ? A : false // nice, I can't even remember implementing this
  const X = Extends({}, Type.Tuple([Type.String(), Type.Number()]), Type.Array(Type.Infer('A', Type.Union([Type.String(), Type.Number()]))))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(X))
  Assert.IsEqual(X.inferred.A.anyOf[0].type, 'string')
  Assert.IsEqual(X.inferred.A.anyOf[1].type, 'number')
})
Test('Should Extends 23', () => {
  type _X = 1 | 2 extends infer X extends 1 ? X : false
  const X = Extends({}, Type.Union([Type.Literal(1), Type.Literal(2)]), Type.Infer('A'))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(X))
  Assert.IsEqual(X.inferred.A.anyOf[0].const, 1)
  Assert.IsEqual(X.inferred.A.anyOf[1].const, 2)
})
Test('Should Extends 24', () => {
  type _X = 1 | 2 extends infer X extends 1 ? X : false
  const X: Type.ExtendsResult.TExtendsFalse = Extends({}, Type.Union([Type.Literal(1), Type.Literal(2)]), Type.Infer('A', Type.Literal(1)))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(X))
})
// ------------------------------------------------------------------
// TryRestInferable
// ------------------------------------------------------------------
Test('Should Extends 25', () => {
  // TryRestInferable: We are merely trying to trigger invariant arms of this expression.
  // I think the difficulty reaching all arms might signal a need to rethink this type.
  // Consider removing this test in future, I don't think it is nessasary.
  const Candidates = [
    Type.Tuple([Type.Infer('A'), Type.Rest(Type.Infer('B', Type.Array(Type.Number())))]),
    Type.Tuple([Type.Infer('A'), Type.Rest(Type.Infer('B', Type.Array(Type.Unknown())))]),
    Type.Tuple([Type.Infer('A'), Type.Rest(Type.Infer('B', Type.Array(Type.Never())))]),
    Type.Tuple([Type.Infer('A'), Type.Rest(Type.Infer('B', Type.Unknown()))]),
    Type.Tuple([Type.Infer('A'), Type.Rest(Type.Infer('B', Type.Never()))]),

    Type.Tuple([Type.Rest(Type.Infer('B', Type.Array(Type.Number())))]),
    Type.Tuple([Type.Rest(Type.Infer('B', Type.Array(Type.Unknown())))]),
    Type.Tuple([Type.Rest(Type.Infer('B', Type.Array(Type.Never())))]),
    Type.Tuple([Type.Rest(Type.Infer('B', Type.Unknown()))]),
    Type.Tuple([Type.Rest(Type.Infer('B', Type.Never()))]),

    Type.Tuple([Type.Rest(Type.Array(Type.Number()))]),
    Type.Tuple([Type.Rest(Type.Array(Type.Never()))]),
    Type.Tuple([Type.Rest(Type.Unknown())]),
    Type.Tuple([Type.Rest(Type.Never())]),

    Type.Tuple([Type.Infer('A', Type.Rest(Type.Number()))]),
    Type.Tuple([Type.Infer('A', Type.Rest(Type.Unknown()))]),
    Type.Tuple([Type.Infer('A', Type.Rest(Type.Never()))]),

    Type.Tuple([Type.Infer('A', Type.Rest(Type.Array(Type.Number())))]),
    Type.Tuple([Type.Infer('A', Type.Rest(Type.Array(Type.Unknown())))]),
    Type.Tuple([Type.Infer('A', Type.Rest(Type.Array(Type.Never())))])
  ]
  for (const Right of Candidates) {
    const Left = Type.Tuple([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
    Extends({}, Left, Right)
  }
})

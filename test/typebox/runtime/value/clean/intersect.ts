import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Intersect')

// ----------------------------------------------------------------
// Intersect
// ----------------------------------------------------------------
Test('Should Clean 1', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 2', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Clean(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 3', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Clean(T, { x: 1, y: 2 })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
Test('Should Clean 4', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
// ----------------------------------------------------------------
// Intersect Discard
// ----------------------------------------------------------------
Test('Should Clean 5', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 6', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Clean(T, { u: null })
  Assert.IsEqual(R, {})
})
Test('Should Clean 7', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Clean(T, { u: null, x: 1, y: 2 })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
Test('Should Clean 8', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const R = Value.Clean(T, { u: null, x: 1, y: 2 })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
// ----------------------------------------------------------------
// Intersect Deep
// ----------------------------------------------------------------
Test('Should Clean 9', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 10', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 11', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Clean 12', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { x: 1, y: 2 })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
Test('Should Clean 13', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
})
Test('Should Clean 14', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { x: 1, y: 2, z: 3, w: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3, w: 3 })
})
Test('Should Clean 15', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { x: 1, y: 2, z: 3, w: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3, w: 3 })
})
// ----------------------------------------------------------------
// Intersect Deep Discard
// ----------------------------------------------------------------
Test('Should Clean 16', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 17', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { u: null })
  Assert.IsEqual(R, {})
})
Test('Should Clean 18', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { u: null, x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Clean 19', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { u: null, x: 1, y: 2 })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
Test('Should Clean 20', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { u: null, x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
})
Test('Should Clean 21', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { u: null, x: 1, y: 2, z: 3, w: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3, w: 3 })
})
Test('Should Clean 22', () => {
  const T = Type.Intersect([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() }),
      Type.Object({ w: Type.Number() })
    ])
  ])
  const R = Value.Clean(T, { u: null, x: 1, y: 2, z: 3, w: 3, a: 1 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3, w: 3 })
})
// ----------------------------------------------------------------
// Intersect Invalid
// ----------------------------------------------------------------
Test('Should Clean 23', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.String() })
  ])
  const R = Value.Clean(T, { x: 1, y: 2 })
  Assert.IsEqual(R, { x: 1, y: 2 }) // types are ignored
})
// ----------------------------------------------------------------
// Intersect Unevaluted Properties
// ----------------------------------------------------------------
Test('Should Clean 24', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.String() })
  ], {
    unevaluatedProperties: Type.String()
  })
  const R = Value.Clean(T, { x: 1, y: 2, a: 1, b: '' })
  Assert.IsEqual(R, { x: 1, y: 2, b: '' })
})
// ----------------------------------------------------------------
// Intersect Illogical
// ----------------------------------------------------------------
Test('Should Clean 25', () => {
  const T = Type.Intersect([
    Type.Number(),
    Type.Object({ x: Type.Number() })
  ])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 26', () => {
  const T = Type.Intersect([
    Type.Number(),
    Type.Object({ x: Type.Number() })
  ])
  const R = Value.Clean(T, 1)
  Assert.IsEqual(R, 1)
})
Test('Should Clean 27', () => {
  const T = Type.Intersect([
    Type.Number(),
    Type.Object({ x: Type.Number() })
  ])
  const R = Value.Clean(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 28', () => {
  const T = Type.Intersect([
    Type.Number(),
    Type.Object({ x: Type.Number() })
  ])
  const R = Value.Clean(T, { x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Clean 29', () => {
  const T = Type.Intersect([
    Type.Number(),
    Type.Object({ x: Type.Number() })
  ])
  const R = Value.Clean(T, { u: null, x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1506
// ------------------------------------------------------------------
Test('Should Clean 30', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Intersect([
      Type.Union([
        Type.Object({ a: Type.Number() }),
        Type.Object({ b: Type.Number() })
      ]),
      Type.Object({ c: Type.Number() })
    ])
  ])
  const V1 = { a: 2, x: 1, c: 3 } // Evaluated[0]
  const V2 = { b: 2, x: 1, c: 3 } // Evaluated[1]
  const R1 = Value.Clean(T, V1)
  const R2 = Value.Clean(T, V2)
  Assert.IsEqual(V1, R1)
  Assert.IsEqual(V2, R2)
})

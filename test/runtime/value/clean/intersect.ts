import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// prettier-ignore
describe('value/clean/Intersect', () => {
  // ----------------------------------------------------------------
  // Intersect
  // ----------------------------------------------------------------
  it('Should clean 1', () => {
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
    const R = Value.Clean(T, null)
    Assert.IsEqual(R, null)
  })
  it('Should clean 2', () => {
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
    const R = Value.Clean(T, {})
    Assert.IsEqual(R, {})
  })
  it('Should clean 3', () => {
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
    const R = Value.Clean(T, { x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should clean 4', () => {
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
  it('Should clean discard 1', () => {
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
    const R = Value.Clean(T, null)
    Assert.IsEqual(R, null)
  })
  it('Should clean discard  2', () => {
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
    const R = Value.Clean(T, { u: null })
    Assert.IsEqual(R, {})
  })
  it('Should clean discard 3', () => {
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
    const R = Value.Clean(T, { u: null, x: 1, y: 2 })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should clean discard 4', () => {
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
  it('Should clear intersect deep 1', () => {
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
  it('Should clear intersect deep 2', () => {
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
  it('Should clear intersect deep 3', () => {
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
  it('Should clear intersect deep 4', () => {
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
  it('Should clear intersect deep 5', () => {
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
  it('Should clear intersect deep 6', () => {
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
  it('Should clear intersect deep 7', () => {
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
  it('Should clear intersect discard deep 1', () => {
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
  it('Should clear intersect discard deep 2', () => {
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
  it('Should clear intersect discard deep 3', () => {
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
  it('Should clear intersect discard deep 4', () => {
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
  it('Should clear intersect discard deep 5', () => {
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
  it('Should clear intersect discard deep 6', () => {
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
  it('Should clear intersect discard deep 7', () => {
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
  it('Should clean intersect invalid 1', () => {
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
  it('Should clean intersect unevaluated properties 1', () => {
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
  it('Should clean illogical 1', () => {
    const T = Type.Intersect([
      Type.Number(),
      Type.Object({ x: Type.Number() })
    ])
    const R = Value.Clean(T, null)
    Assert.IsEqual(R, null)
  })
  it('Should clean illogical 2', () => {
    const T = Type.Intersect([
      Type.Number(),
      Type.Object({ x: Type.Number() })
    ])
    const R = Value.Clean(T, 1)
    Assert.IsEqual(R, 1)
  })
  it('Should clean illogical 3', () => {
    const T = Type.Intersect([
      Type.Number(),
      Type.Object({ x: Type.Number() })
    ])
    const R = Value.Clean(T, {})
    Assert.IsEqual(R, {})
  })
  it('Should clean illogical 4', () => {
    const T = Type.Intersect([
      Type.Number(),
      Type.Object({ x: Type.Number() })
    ])
    const R = Value.Clean(T, { x: 1 })
    Assert.IsEqual(R, { x: 1 })
  })
  it('Should clean illogical 5', () => {
    const T = Type.Intersect([
      Type.Number(),
      Type.Object({ x: Type.Number() }),
    ])
    const R = Value.Clean(T, { u: null, x: 1 })
    Assert.IsEqual(R, { u: null, x: 1 }) // u retained from Number
  })
})

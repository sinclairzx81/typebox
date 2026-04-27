import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Refine')

// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1414
// ------------------------------------------------------------------
Test('Should Refine 1', () => {
  const T = Type.Refine(
    Type.Object({
      greater: Type.Integer({ default: 10 }),
      smaller: Type.Integer({ default: 5 })
    }),
    (value) => value.greater > value.smaller
  )
  const R = Value.Repair(T, { greater: 3, smaller: 7 })
  Assert.IsEqual(R, {
    greater: 10,
    smaller: 5
  })
})
Test('Should Refine 2', () => {
  const T = Type.Refine(
    Type.Object({
      greater: Type.Integer(),
      smaller: Type.Integer()
    }, {
      default: {
        greater: 10,
        smaller: 5
      }
    }),
    (value) => value.greater > value.smaller
  )
  const R = Value.Repair(T, { greater: 3, smaller: 7 })
  Assert.IsEqual(R, {
    greater: 10,
    smaller: 5
  })
})
Test('Should Refine 3', () => {
  const T = Type.Refine(
    Type.Object({
      greater: Type.Integer({ default: 10 }),
      smaller: Type.Integer({ default: 5 })
    }, {
      default: { // top-level overrides subschema
        greater: 100,
        smaller: 50
      }
    }),
    (value) => value.greater > value.smaller
  )
  const R = Value.Repair(T, { greater: 3, smaller: 7 })
  Assert.IsEqual(R, {
    greater: 100,
    smaller: 50
  })
})
// ------------------------------------------------------------------
// Coverage (Fall through case for when post refine-checks pass)
// ------------------------------------------------------------------
Test('Should Refine 4', () => {
  const T = Type.Refine(
    Type.Object({
      greater: Type.Integer({ default: 10 }),
      smaller: Type.Integer({ default: 5 })
    }),
    (value) => value.greater > value.smaller
  )
  const R = Value.Repair(T, { greater: 10, smaller: 5 })
  Assert.IsEqual(R, {
    greater: 10,
    smaller: 5
  })
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1414#issuecomment-3420056090
// ------------------------------------------------------------------
Test('Should Refine 5', () => {
  const T = Type.Object({
    bounds: Type.Refine(
      Type.Object({
        max: Type.Integer({ default: 10 }),
        min: Type.Integer({ default: 5 })
      }),
      (value) => value.max > value.min
    ),
    otherData: Type.String({ default: '' })
  })
  const R = Value.Repair(T, { bounds: { max: 10, min: 15 }, otherData: 'keep this' })
  Assert.IsEqual(R, { bounds: { max: 10, min: 5 }, otherData: 'keep this' })
})

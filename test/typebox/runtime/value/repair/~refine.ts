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
    (data) => data.greater > data.smaller
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
    (data) => data.greater > data.smaller
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
    (data) => data.greater > data.smaller
  )
  const R = Value.Repair(T, { greater: 3, smaller: 7 })
  Assert.IsEqual(R, {
    greater: 100,
    smaller: 50
  })
})

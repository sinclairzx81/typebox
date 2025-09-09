import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsUnevaluatedItems')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsUnevaluatedItems({ unevaluatedItems: { type: 'boolean' } }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsUnevaluatedItems({}))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsUnevaluatedItems({ unevaluatedItems: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsUnevaluatedItems({ unevaluatedItems: null }))
})

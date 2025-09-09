import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMinItems')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMinItems({ minItems: 1 }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsMinItems({ minItems: '1' }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMinItems({ minItems: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMinItems({}))
})

import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsAdditionalItems')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsAdditionalItems({
    additionalItems: {}
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsAdditionalItems({
    additionalItems: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsAdditionalItems({
    additionalItems: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsAdditionalItems({}))
})

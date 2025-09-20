import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsAdditionalProperties')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsAdditionalProperties({
    additionalProperties: {}
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsAdditionalProperties({
    additionalProperties: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsAdditionalProperties({
    additionalProperties: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsAdditionalProperties({}))
})

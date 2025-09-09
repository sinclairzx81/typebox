import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsOneOf')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsOneOf({ oneOf: [{}] }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsOneOf({ oneOf: null }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsOneOf({ oneOf: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsOneOf({ oneOf: [123] }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsOneOf({}))
})

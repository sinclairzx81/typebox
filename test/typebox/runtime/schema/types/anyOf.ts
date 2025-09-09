import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsAnyOf')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsAnyOf({
    anyOf: [{}]
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsAnyOf({
    anyOf: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsAnyOf({
    anyOf: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsAnyOf({
    anyOf: [123]
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsAnyOf({}))
})

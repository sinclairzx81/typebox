import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsProperties')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsProperties({ properties: { foo: {}, bar: {} } }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsProperties({ properties: null }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsProperties({ properties: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsProperties({ properties: { foo: 123 } }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsProperties({}))
})

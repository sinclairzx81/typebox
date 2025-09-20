import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsPropertyNames')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsPropertyNames({ propertyNames: {} }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsPropertyNames({ propertyNames: null }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsPropertyNames({ propertyNames: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsPropertyNames({}))
})

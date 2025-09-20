import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsDependentSchemas')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsDependentSchemas({
    dependentSchemas: { foo: {}, bar: {} }
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsDependentSchemas({
    dependentSchemas: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsDependentSchemas({
    dependentSchemas: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsDependentSchemas({
    dependentSchemas: { foo: 123 }
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsDependentSchemas({}))
})

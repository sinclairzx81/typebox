import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsDependentRequired')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsDependentRequired({
    dependentRequired: { foo: ['a', 'b'], bar: [] }
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsDependentRequired({
    dependentRequired: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsDependentRequired({
    dependentRequired: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsDependentRequired({
    dependentRequired: { foo: 123 }
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsDependentRequired({
    dependentRequired: { foo: [123] }
  }))
})
Test('Should Guard 6', () => {
  Assert.IsFalse(Schema.IsDependentRequired({}))
})

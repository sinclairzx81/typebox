import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsDependencies')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsDependencies({
    dependencies: { foo: {}, bar: ['a', 'b'] }
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsDependencies({
    dependencies: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsDependencies({
    dependencies: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsDependencies({
    dependencies: { foo: 123 }
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsDependencies({}))
})

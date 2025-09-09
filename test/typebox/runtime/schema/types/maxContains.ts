import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMaxContains')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMaxContains({ maxContains: 5 }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsMaxContains({ maxContains: '5' }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMaxContains({ maxContains: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMaxContains({}))
})

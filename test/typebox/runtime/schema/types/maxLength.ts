import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMaxLength')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMaxLength({ maxLength: 5 }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsMaxLength({ maxLength: '5' }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMaxLength({ maxLength: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMaxLength({}))
})

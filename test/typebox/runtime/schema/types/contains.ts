import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsContains')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsContains({
    contains: {}
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsContains({
    contains: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsContains({
    contains: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsContains({}))
})

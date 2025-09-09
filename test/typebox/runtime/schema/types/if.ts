import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsIf')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsIf({
    if: {}
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsIf({
    if: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsIf({
    if: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsIf({}))
})

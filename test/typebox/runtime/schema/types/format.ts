import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsFormat')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsFormat({
    format: 'date-time'
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsFormat({
    format: 123
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsFormat({
    format: null
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsFormat({}))
})

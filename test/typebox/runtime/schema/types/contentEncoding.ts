import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsContentEncoding')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsContentEncoding({
    contentEncoding: 'utf-8'
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsContentEncoding({
    contentEncoding: 123
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsContentEncoding({
    contentEncoding: null
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsContentEncoding({}))
})

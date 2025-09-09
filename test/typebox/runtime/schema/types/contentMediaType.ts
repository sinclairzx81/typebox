import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsContentMediaType')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsContentMediaType({
    contentMediaType: 'application/json'
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsContentMediaType({
    contentMediaType: 123
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsContentMediaType({
    contentMediaType: null
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsContentMediaType({}))
})

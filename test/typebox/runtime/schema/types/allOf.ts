import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsAllOf')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsAllOf({
    allOf: [{}]
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsAllOf({
    allOf: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsAllOf({
    allOf: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsAllOf({
    allOf: [123]
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsAllOf({}))
})

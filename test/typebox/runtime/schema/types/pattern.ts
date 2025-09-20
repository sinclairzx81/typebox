import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsPattern')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsPattern({ pattern: 'abc' }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsPattern({ pattern: /abc/ }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsPattern({ pattern: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsPattern({ pattern: null }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsPattern({}))
})

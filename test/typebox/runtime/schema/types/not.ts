import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsNot')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsNot({ not: {} }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsNot({ not: null }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsNot({ not: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsNot({}))
})

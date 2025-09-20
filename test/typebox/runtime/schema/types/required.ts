import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsRequired')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsRequired({ required: ['a', 'b'] }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsRequired({ required: null }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsRequired({ required: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsRequired({ required: [123] }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsRequired({}))
})

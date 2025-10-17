import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsSchemaLike')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsSchema({ type: 'string' }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsSchema(true))
})
Test('Should Guard 3', () => {
  Assert.IsTrue(Schema.IsSchema(false))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsSchema(123))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsSchema('true'))
})
Test('Should Guard 6', () => {
  Assert.IsFalse(Schema.IsSchema(null))
})
Test('Should Guard 7', () => {
  Assert.IsFalse(Schema.IsSchema(undefined))
})

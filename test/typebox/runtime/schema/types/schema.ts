import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsSchemaLike')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsSchemaLike({ type: 'string' }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsSchemaLike(true))
})
Test('Should Guard 3', () => {
  Assert.IsTrue(Schema.IsSchemaLike(false))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsSchemaLike(123))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsSchemaLike('true'))
})
Test('Should Guard 6', () => {
  Assert.IsFalse(Schema.IsSchemaLike(null))
})
Test('Should Guard 7', () => {
  Assert.IsFalse(Schema.IsSchemaLike(undefined))
})

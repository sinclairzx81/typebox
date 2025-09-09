import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsType')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsType({ type: 'string' }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsType({ type: ['string', 'number'] }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsType({ type: [123, 'string'] }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsType({ type: 123 }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsType({ type: null }))
})
Test('Should Guard 6', () => {
  Assert.IsFalse(Schema.IsType({}))
})

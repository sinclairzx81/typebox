import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMinimum')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMinimum({ minimum: 1 }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsMinimum({ minimum: BigInt(1) }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMinimum({ minimum: '1' }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMinimum({ minimum: null }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsMinimum({}))
})

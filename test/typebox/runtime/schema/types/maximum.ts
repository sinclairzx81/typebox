import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMaximum')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMaximum({ maximum: 10 }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsMaximum({ maximum: BigInt(10) }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMaximum({ maximum: '10' }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMaximum({ maximum: null }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsMaximum({}))
})

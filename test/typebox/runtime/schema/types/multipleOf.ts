import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMultipleOf')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMultipleOf({ multipleOf: 2 }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsMultipleOf({ multipleOf: BigInt(2) }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMultipleOf({ multipleOf: '2' }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMultipleOf({ multipleOf: null }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsMultipleOf({}))
})

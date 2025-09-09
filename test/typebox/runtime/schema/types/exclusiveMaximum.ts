import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsExclusiveMaximum')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsExclusiveMaximum({
    exclusiveMaximum: 10
  }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsExclusiveMaximum({
    exclusiveMaximum: BigInt(10)
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsExclusiveMaximum({
    exclusiveMaximum: '10'
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsExclusiveMaximum({
    exclusiveMaximum: null
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsExclusiveMaximum({}))
})

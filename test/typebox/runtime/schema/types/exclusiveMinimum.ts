import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsExclusiveMinimum')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsExclusiveMinimum({
    exclusiveMinimum: 10
  }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsExclusiveMinimum({
    exclusiveMinimum: BigInt(10)
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsExclusiveMinimum({
    exclusiveMinimum: '10'
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsExclusiveMinimum({
    exclusiveMinimum: null
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsExclusiveMinimum({}))
})

import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsId')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsId({
    $id: 'my-id'
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsId({
    $id: 123
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsId({
    $id: null
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsId({}))
})

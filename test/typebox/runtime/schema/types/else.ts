import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsElse')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsElse({
    else: {}
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsElse({
    else: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsElse({
    else: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsElse({}))
})

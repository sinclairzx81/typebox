import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsDefault')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsDefault({
    default: 123
  }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsDefault({
    default: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsDefault({}))
})

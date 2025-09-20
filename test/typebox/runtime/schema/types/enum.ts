import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsEnum')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsEnum({
    enum: [1, 2, 3]
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsEnum({
    enum: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsEnum({
    enum: 123
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsEnum({}))
})

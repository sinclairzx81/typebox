import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsThen')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsThen({ then: { type: 'string' } }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsThen({}))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsThen({ then: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsThen({ then: null }))
})

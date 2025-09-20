import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMinProperties')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMinProperties({ minProperties: 1 }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsMinProperties({ minProperties: '1' }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMinProperties({ minProperties: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMinProperties({}))
})

import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMaxProperties')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMaxProperties({ maxProperties: 5 }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsMaxProperties({ maxProperties: '5' }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMaxProperties({ maxProperties: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMaxProperties({}))
})

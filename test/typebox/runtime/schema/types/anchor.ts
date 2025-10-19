import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsAnchor')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsAnchor({ $anchor: 'my-ref' }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsAnchor({ $anchor: 123 }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsAnchor({ $anchor: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsAnchor({}))
})

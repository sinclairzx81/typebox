import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsPrefixItems')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsPrefixItems({ prefixItems: [{}] }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsPrefixItems({ prefixItems: null }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsPrefixItems({ prefixItems: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsPrefixItems({ prefixItems: [{}, 123] }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsPrefixItems({}))
})

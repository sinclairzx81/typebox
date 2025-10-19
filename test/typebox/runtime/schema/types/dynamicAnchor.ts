import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsDynamicAnchor')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsDynamicAnchor({ $dynamicAnchor: 'my-ref' }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsDynamicAnchor({ $dynamicAnchor: 123 }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsDynamicAnchor({ $dynamicAnchor: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsDynamicAnchor({}))
})

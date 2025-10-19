import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsDynamicRef')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsDynamicRef({ $dynamicRef: 'my-ref' }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsDynamicRef({ $dynamicRef: 123 }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsDynamicRef({ $dynamicRef: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsDynamicRef({}))
})

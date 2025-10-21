import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsRecursiveAnchor')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsRecursiveAnchor({ $recursiveAnchor: true }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsRecursiveAnchor({ $recursiveAnchor: false }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsRecursiveAnchor({ $recursiveAnchor: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsRecursiveAnchor({ $recursiveAnchor: null }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsRecursiveAnchor({}))
})

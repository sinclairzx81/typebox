import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsRecursiveRef')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsRecursiveRef({ $recursiveRef: 'my-ref' }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsRecursiveRef({ $recursiveRef: 123 }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsRecursiveRef({ $recursiveRef: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsRecursiveRef({}))
})

import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsRef')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsRef({ $ref: 'my-ref' }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsRef({ $ref: 123 }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsRef({ $ref: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsRef({}))
})

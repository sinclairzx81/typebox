import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsUnevaluatedProperties')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsUnevaluatedProperties({ unevaluatedProperties: { type: 'string' } }))
})

Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsUnevaluatedProperties({}))
})

Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsUnevaluatedProperties({ unevaluatedProperties: 456 }))
})

Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsUnevaluatedProperties({ unevaluatedProperties: null }))
})

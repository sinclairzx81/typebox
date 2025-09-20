import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsPatternProperties')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsPatternProperties({ patternProperties: { foo: {}, bar: {} } }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsPatternProperties({ patternProperties: null }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsPatternProperties({ patternProperties: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsPatternProperties({ patternProperties: { foo: 123 } }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsPatternProperties({}))
})

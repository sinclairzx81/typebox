import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMaxItems')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMaxItems({ maxItems: 5 }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsMaxItems({ maxItems: '5' }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMaxItems({ maxItems: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMaxItems({}))
})

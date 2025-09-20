import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsUniqueItems')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsUniqueItems({ uniqueItems: true }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsUniqueItems({ uniqueItems: false }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsUniqueItems({ uniqueItems: 'true' }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsUniqueItems({ uniqueItems: 1 }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsUniqueItems({ uniqueItems: null }))
})
Test('Should Guard 6', () => {
  Assert.IsFalse(Schema.IsUniqueItems({}))
})

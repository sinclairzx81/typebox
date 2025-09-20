import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsItems')

// ------------------------------------------------------------------
// IsItems
// ------------------------------------------------------------------
Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsItems({ items: {} }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsItems({ items: [{}, {}] }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsItems({ items: 123 }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsItems({ items: [{}, 123] }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsItems({}))
})
// ------------------------------------------------------------------
// IsItemsSized
// ------------------------------------------------------------------
Test('Should Guard 6', () => {
  Assert.IsTrue(Schema.IsItemsSized({ items: [{}, {}] }))
})
Test('Should Guard 7', () => {
  Assert.IsFalse(Schema.IsItemsSized({ items: {} }))
})
// ------------------------------------------------------------------
// IsItemsUnsized
// ------------------------------------------------------------------
Test('Should Guard 8', () => {
  Assert.IsFalse(Schema.IsItemsUnsized({ items: [{}, {}] }))
})
Test('Should Guard 9', () => {
  Assert.IsTrue(Schema.IsItemsUnsized({ items: {} }))
})
Test('Should Guard 10', () => {
  Assert.IsTrue(Schema.IsItemsUnsized({ items: {} }))
})
Test('Should Guard 11', () => {
  Assert.IsFalse(Schema.IsItemsUnsized({ items: [{}, {}] }))
})
Test('Should Guard 12', () => {
  Assert.IsFalse(Schema.IsItemsUnsized({}))
})

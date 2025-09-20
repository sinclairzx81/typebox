import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsMinContains')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsMinContains({ minContains: 1 }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsMinContains({ minContains: '1' }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsMinContains({ minContains: null }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsMinContains({}))
})

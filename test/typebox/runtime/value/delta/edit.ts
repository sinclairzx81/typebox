import { Delete, Edit, Insert, Update, Value } from 'typebox/value'
import { Assert } from 'test'

const Test = Assert.Context('Value.Edit')

Test('Should construct valid JSON schemas for Insert, Update, Delete, and Edit', () => {
  Assert.IsEqual(Insert.type, 'object')
  Assert.IsEqual(Update.type, 'object')
  Assert.IsEqual(Delete.type, 'object')
  Assert.IsEqual(Edit.anyOf.length, 3)
})

Test('Should validate valid Update edits and reject invalid values', () => {
  Assert.IsTrue(Value.Check(Update, { type: 'update', path: '/a', value: 1 }))
  Assert.IsTrue(Value.Check(Update, { type: 'update', path: '', value: null }))
  Assert.IsFalse(Value.Check(Update, 123))
  Assert.IsFalse(Value.Check(Update, 'invalid'))
  Assert.IsFalse(Value.Check(Update, { type: 'insert', path: '/a', value: 1 }))
  Assert.IsFalse(Value.Check(Update, { type: 'update', path: 123, value: 1 }))
  Assert.IsFalse(Value.Check(Update, { type: 'update', path: '/a' }))
})

Test('Should validate valid Edit union values and reject invalid values', () => {
  Assert.IsTrue(Value.Check(Edit, { type: 'insert', path: '/a', value: 1 }))
  Assert.IsTrue(Value.Check(Edit, { type: 'update', path: '/a', value: 2 }))
  Assert.IsTrue(Value.Check(Edit, { type: 'delete', path: '/a' }))
  Assert.IsFalse(Value.Check(Edit, 123))
  Assert.IsFalse(Value.Check(Edit, 'totally-invalid'))
  Assert.IsFalse(Value.Check(Edit, { type: 'update', path: 999 }))
  Assert.IsFalse(Value.Check(Edit, { type: 'unknown', path: '/a' }))
})

Test('Should validate all edits produced by Value.Diff against Edit schema', () => {
  const edits = Value.Diff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 })
  Assert.IsEqual(edits.length, 2)
  for (const edit of edits) {
    Assert.IsTrue(Value.Check(Edit, edit))
  }
})

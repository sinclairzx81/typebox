import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsConst')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsConst({
    const: 123
  }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsConst({
    const: null
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsConst({}))
})

import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsRefine')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsRefine({
    '~refine': []
  }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsRefine({
    '~refine': [{ check: (value: unknown) => true, error: () => 'fail' }]
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsRefine({
    '~refine': [1]
  }))
})

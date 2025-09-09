import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsRefine')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsRefine({
    '~refine': []
  }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsRefine({
    '~refine': [{ callback: (value: unknown) => true, message: 'fail' }]
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsRefine({
    '~refine': [1]
  }))
})

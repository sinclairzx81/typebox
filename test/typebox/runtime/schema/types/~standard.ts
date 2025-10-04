import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsValidator')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsValidator({
    '~validator': {
      Check: (value: unknown) => true,
      Errors: (value: unknown) => []
    }
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsValidator({
    '~validator': {
      Check: (value: unknown) => true
    }
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsValidator({
    '~validator': {
      Errors: (value: unknown) => []
    }
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsValidator({
    '~validator': {
      Check: 1,
      Errors: (value: unknown) => []
    }
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsValidator({
    '~validator': {
      Check: (value: unknown) => true,
      Errors: 1
    }
  }))
})

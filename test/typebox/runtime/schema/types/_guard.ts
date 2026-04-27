import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsGuard')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsGuard({
    '~guard': {
      check: (value: unknown) => true,
      errors: (value: unknown) => []
    }
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsGuard({
    '~guard': {
      check: (value: unknown) => true
    }
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsGuard({
    '~guard': {
      errors: (value: unknown) => []
    }
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsGuard({
    '~guard': {
      check: 1,
      errors: (value: unknown) => []
    }
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsGuard({
    '~guard': {
      check: (value: unknown) => true,
      errors: 1
    }
  }))
})

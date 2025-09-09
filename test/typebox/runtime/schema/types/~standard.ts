import { Schema } from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsStandardSchemaV1')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsStandardSchemaV1({
    '~standard': {
      version: 1,
      vendor: 'acme',
      validate: (value: unknown) => true
    }
  }))
})
Test('Should Guard 2', () => {
  Assert.IsFalse(Schema.IsStandardSchemaV1({
    '~standard': {
      version: 2,
      vendor: 'acme',
      validate: (value: unknown) => true
    }
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsStandardSchemaV1({
    '~standard': {
      version: 1,
      vendor: 123,
      validate: (value: unknown) => true
    }
  }))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsStandardSchemaV1({
    '~standard': {
      version: 1,
      vendor: 'acme',
      validate: 'notAFunction'
    }
  }))
})
Test('Should Guard 5', () => {
  Assert.IsFalse(Schema.IsStandardSchemaV1({
    '~standard': {
      vendor: 'acme',
      validate: (value: unknown) => true
    }
  }))
})

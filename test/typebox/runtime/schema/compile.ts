import System from 'typebox/system'
import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.Compile')

// ------------------------------------------------------------------
// IsAccelerated
// ------------------------------------------------------------------
Test('Should IsAccelerated 1', () => {
  const validator = Schema.Compile({ type: 'string' })
  Assert.IsTrue(validator.IsAccelerated())
})
Test('Should IsAccelerated 2', () => {
  System.Settings.Set({ useAcceleration: false })
  const validator = Schema.Compile({ type: 'string' })
  Assert.IsFalse(validator.IsAccelerated())
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// Without Context
// ------------------------------------------------------------------
Test('Should Compile 1', () => {
  const validator = Schema.Compile({ type: 'string' })
  const [result, errors] = validator.Errors(1)
  Assert.IsFalse(result)
  Assert.IsTrue(errors.length > 0)
})
Test('Should Compile 2', () => {
  const validator = Schema.Compile({ type: 'string' })
  Assert.IsTrue(validator.Check('hello'))
})
Test('Should Compile 3', () => {
  const validator = Schema.Compile({ type: 'string' })
  Assert.IsEqual(validator.Parse('hello'), 'hello')
})
Test('Should Compile 4', () => {
  const validator = Schema.Compile({ type: 'string' })
  Assert.Throws(() => validator.Parse(1))
})
// ------------------------------------------------------------------
// With Context
// ------------------------------------------------------------------
Test('Should Compile 5', () => {
  const validator = Schema.Compile({ A: { type: 'string' } }, { $ref: 'A' })
  const [result, errors] = validator.Errors(1)
  Assert.IsFalse(result)
  Assert.IsTrue(errors.length > 0)
})
Test('Should Compile 6', () => {
  const validator = Schema.Compile({ A: { type: 'string' } }, { $ref: 'A' })
  Assert.IsTrue(validator.Check('hello'))
})
Test('Should Compile 7', () => {
  const validator = Schema.Compile({ A: { type: 'string' } }, { $ref: 'A' })
  Assert.IsEqual(validator.Parse('hello'), 'hello')
})
Test('Should Compile 8', () => {
  const validator = Schema.Compile({ A: { type: 'string' } }, { $ref: 'A' })
  Assert.Throws(() => validator.Parse(1))
})

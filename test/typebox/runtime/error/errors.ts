import { Assert } from 'test'
import Type from 'typebox'
import Value from 'typebox/value'
import { IsLocalizedValidationError } from 'typebox/error'
const Test = Assert.Context('Error.Errors')

// ------------------------------------------------------------------
// IsLocalizedValidationError
// ------------------------------------------------------------------
Test('Should IsLocalizedValidationError 1', () => {
  const R = Value.Errors(Type.String(), null)
  R.forEach((error) => Assert.IsTrue(IsLocalizedValidationError(error)))
})

import { Build, Check, Errors } from 'typebox/schema'
import { Spec } from './harness.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
Spec('Schema.Build', (context, schema, value) => {
  return Build(context, schema).Evaluate().Check(value)
})
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Spec('Schema.Check', (context, schema, value) => {
  return Check(context, schema, value)
})
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
Spec('Schema.Error', (context, schema, value) => {
  const [valid, errors] = Errors(context, schema, value)
  if (valid && errors.length > 0) throw new Error('expected no errors for a valid value')
  if (!valid && errors.length === 0) throw new Error('expected errors for an invalid value')
  return valid
})

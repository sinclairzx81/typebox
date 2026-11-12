import * as Schema from 'typebox/schema'
import * as Harness from './harness.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
Harness.Spec('Schema.Build', (context, schema, value) => {
  return Schema.Build(context, schema).Evaluate().Check(value)
})
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Harness.Spec('Schema.Check', (context, schema, value) => {
  return Schema.Check(context, schema, value)
})
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
Harness.Spec('Schema.Error', (context, schema, value) => {
  const [valid, errors] = Schema.Errors(context, schema, value)
  if (valid && errors.length > 0) throw new Error('expected no errors for a valid value')
  if (!valid && errors.length === 0) throw new Error('expected errors for an invalid value')
  return valid
})

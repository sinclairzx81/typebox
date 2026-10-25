import NodeModule from 'node:module'
import Module from 'typebox/module'
import Schema from 'typebox/schema'
import { Spec } from './harness.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
Spec('Schema.Build', (context, schema, value) => {
  return Schema.Build(context, schema).Evaluate().Check(value)
})
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Spec('Schema.Check', (context, schema, value) => {
  return Schema.Check(context, schema, value)
})
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
Spec('Schema.Error', (context, schema, value) => {
  const [valid, errors] = Schema.Errors(context, schema, value)
  if (valid && errors.length > 0) throw new Error('expected no errors for a valid value')
  if (!valid && errors.length === 0) throw new Error('expected errors for an invalid value')
  return valid
})
// ------------------------------------------------------------------
// Module
// ------------------------------------------------------------------
Spec('Module.Spec', async (context, schema, value) => {
  const code = NodeModule.stripTypeScriptTypes(Module.Build(context, schema))
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
  const validator = await import(url)
  return validator.Check(value)
})
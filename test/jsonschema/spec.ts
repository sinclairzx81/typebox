import { Build, Check, Errors, Intern } from 'typebox/schema'
import { Guard } from 'typebox/guard'
import { Hashing } from 'typebox/system'
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
// ------------------------------------------------------------------
// Intern
// ------------------------------------------------------------------
Spec('Schema.Intern', (context, schema, value) => {
  const intern = Intern(context, schema)
  const hasRef = Guard.HasPropertyKey(intern, '$ref')
  const hasDefs = Guard.HasPropertyKey(intern, '$defs')
  const hasOnly = Guard.IsEqual(Object.keys(intern).length, 2)
  const isIdempotent = Guard.IsDeepEqual(intern, Intern(context, intern))
  const isHashed = Guard.Keys(intern.$defs).every((key) => key === `x-${Hashing.Hash(intern.$defs[key])}`)
  const isNew = !(intern === Intern(intern)) // should be a new object ference
  if (!hasRef) throw new Error('expected $ref')
  if (!hasDefs) throw new Error('expected $defs')
  if (!hasOnly) throw new Error('expected only $ref and $defs')
  if (!isIdempotent) throw new Error('expected intern to be idempotent')
  if (!isHashed) throw new Error('expected all definitions to be content hashed')
  if (!isNew) throw new Error('expected intern result to be new object reference')
  return Check(intern, value)
})
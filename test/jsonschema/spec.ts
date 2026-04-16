import { Build, Check, Errors } from 'typebox/schema'
import { Assert } from 'test'
import { enumerateTests } from './enumerator.ts'
import { Pointer } from 'typebox/value'

// ------------------------------------------------------------------
// Drafts
// ------------------------------------------------------------------
run('draft-3', 'test/jsonschema/cases/draft3')
run('draft-4', 'test/jsonschema/cases/draft4')
run('draft-6', 'test/jsonschema/cases/draft6')
run('draft-7', 'test/jsonschema/cases/draft7')
run('draft-2019', 'test/jsonschema/cases/draft2019-09')
run('draft-2020', 'test/jsonschema/cases/draft2020-12')
run('v1', 'test/jsonschema/cases/v1')

// ------------------------------------------------------------------
// Run
// ------------------------------------------------------------------
function run(draft: string, path: string): void {
  runCheck(draft, path)
  runBuild(draft, path)
  runError(draft, path)
}
// ------------------------------------------------------------------
// Types & Helpers
// ------------------------------------------------------------------
interface Operation {
  type: 'Build' | 'Check' | 'Errors'
  schema: unknown
  data: unknown
  description: string
  valid: boolean
  result: boolean
  errors?: unknown[]
}
function formatMessage(example: string, description: string, valid: boolean, result: boolean): string {
  const expect = `// ${description} | expect: ${valid}, actual: ${result}`
  return `\n\n${expect}\n${example}\n\n`
}
function formatThrow(example: string, description: string): string {
  const expect = `// ${description}`
  return `\n\n${expect}\n${example}\n\n`
}
function assertThrow(op: Operation) {
  const { type, schema, data, description } = op
  const schemaStr = JSON.stringify(schema, null, 2)
  const dataStr = JSON.stringify(data, null, 2)
  let example: string
  switch (type) {
    case 'Build':
      example = `const R = Schema.Build(${schemaStr}).Evaluate().Check(${dataStr})`
      break
    case 'Check':
      example = `const R = Schema.Check(${schemaStr}, ${dataStr})`
      break
    case 'Errors':
      example = `const R = Schema.Errors(${schemaStr}, ${dataStr})`
      break
  }
  const message = 'Maximum call stack exceeded ' + formatThrow(example, description)
  throw new Error(message)
}
function assertResult(op: Operation): void {
  const { type, schema, data, description, valid, result, errors = [] } = op
  const schemaStr = JSON.stringify(schema, null, 2)
  const dataStr = JSON.stringify(data, null, 2)
  let example: string
  switch (type) {
    case 'Build':
      example = `const R = Schema.Build(${schemaStr}).Evaluate().Check(${dataStr})`
      break
    case 'Check':
      example = `const R = Schema.Check(${schemaStr}, ${dataStr})`
      break
    case 'Errors':
      example = `const R = Schema.Errors(${schemaStr}, ${dataStr})`
      break
  }
  const message = formatMessage(example, description, valid, result)
  if (result !== valid) throw new Error(message)
  if (type === 'Errors') {
    if (result && (errors as unknown[]).length > 0) throw new Error(message)
    if (!result && (errors as unknown[]).length === 0) throw new Error(message)
  }
}
// ------------------------------------------------------------------
// Test runners
// ------------------------------------------------------------------
function runBuild(draft: string, path: string): void {
  const Test = Assert.Context('Schema.Build')
  for (const test of enumerateTests(path)) {
    Test(`${draft} ${test.filename}: ${test.description}`, () => {
      const result = Build({}, test.schema).Evaluate().Check(test.data)
      assertResult({ type: 'Build', schema: test.schema, data: test.data, description: test.description, valid: test.valid, result })
    })
  }
}
function runCheck(draft: string, path: string): void {
  const Test = Assert.Context('Schema.Check')
  for (const test of enumerateTests(path)) {
    Test(`${draft} ${test.filename}: ${test.description}`, () => {
      let result = false 
      try {
        result = Check({}, test.schema, test.data)
      } catch {
        assertThrow({ type: 'Check', schema: test.schema, data: test.data, description: test.description, valid: test.valid, result })
        return
      }
      assertResult({ type: 'Check', schema: test.schema, data: test.data, description: test.description, valid: test.valid, result })
    })
  }
}
function runError(draft: string, path: string): void {
  const Test = Assert.Context('Schema.Errors')
  for (const test of enumerateTests(path)) {
    Test(`${draft} ${test.filename}: ${test.description}`, () => {
      const [result, errors] = Errors({}, test.schema, test.data)
      assertResult({ type: 'Errors', schema: test.schema, data: test.data, description: test.description, valid: test.valid, result, errors })
      if (result) return
      // if error, the schemaPath must point to subschema
      errors.forEach((error) => Assert.IsDefined(Pointer.Get(test.schema, error.schemaPath.slice(1))))
    })
  }
}
 
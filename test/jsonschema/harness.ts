
import Path from 'node:path'
import Fs from 'node:fs'
import Schema from 'typebox/schema'
import Guard from 'typebox/guard'
import { Assert } from 'test'
import * as Model from '../../task/spec/model.ts'

// ------------------------------------------------------------------
// Test Directory
// ------------------------------------------------------------------
const TEST_DIRECTORY = 'test/jsonschema/cases/pass'

// ------------------------------------------------------------------
// Harness Types
// ------------------------------------------------------------------
type TestCase = {
  description: string
  data: unknown
  valid: boolean
}
type Section = {
  description: string
  schema: object | boolean
  compatibility?: string
  externalSchemas?: Record<string, Schema.XSchema>
  tags?: string[]
  tests: TestCase[]
}
type Document = Section[]
interface Test {
  filename: string
  context: string
  externalSchemas?: Record<string, Schema.XSchema>
  schema: Schema.XSchema
  description: string
  data: unknown
  valid: boolean
}
type SpecCallback = (
  context: Record<PropertyKey, Schema.XSchema>,
  schema: Schema.XSchema,
  value: unknown
) => boolean
// ------------------------------------------------------------------
// Harness Constants
// ------------------------------------------------------------------
const DRAFT_LABELS: Record<string, string> = {
  draft3: 'draft-3',
  draft4: 'draft-4',
  draft6: 'draft-6',
  draft7: 'draft-7',
  'draft2019-09': 'draft-2019',
  'draft2020-12': 'draft-2020',
  v1: 'v1'
}
// ------------------------------------------------------------------
// IsSchema
// ------------------------------------------------------------------
function IsSchema(value: unknown): value is Schema.XSchema {
  return Guard.IsObjectNotArray(value) || Guard.IsBoolean(value)
}
// ------------------------------------------------------------------
// IsExternalSchemas
// ------------------------------------------------------------------
function IsExternalSchemas(value: unknown): value is Record<string, Schema.XSchema> {
  return Guard.IsObjectNotArray(value) && Object.values(value).every(IsSchema)
}
// ------------------------------------------------------------------
// IsTestCase
// ------------------------------------------------------------------
function IsTestCase(value: unknown): value is TestCase {
  return Guard.IsObjectNotArray(value) &&
    Guard.HasPropertyKey(value, 'valid') &&
    Guard.HasPropertyKey(value, 'description') &&
    Guard.HasPropertyKey(value, 'data') &&
    Guard.IsString(value.description) &&
    Guard.IsBoolean(value.valid)
}
// ------------------------------------------------------------------
// IsSection
// ------------------------------------------------------------------
function IsSection(value: unknown): value is Section {
  return Guard.IsObjectNotArray(value) &&
    Guard.IsString(value.description) &&
    IsSchema(value.schema) &&
    (Guard.IsUndefined(value.compatibility) || Guard.IsString(value.compatibility)) &&
    (Guard.IsUndefined(value.externalSchemas) || IsExternalSchemas(value.externalSchemas)) &&
    (Guard.IsUndefined(value.tags) || (Guard.IsArray(value.tags) && value.tags.every(Guard.IsString))) &&
    Guard.IsArray(value.tests) &&
    value.tests.every(IsTestCase)
}
// ------------------------------------------------------------------
// IsDocument
// ------------------------------------------------------------------
function IsDocument(value: unknown): value is Document {
  return Guard.IsArray(value) && value.every(IsSection)
}
// ------------------------------------------------------------------
// ReadJson
// ------------------------------------------------------------------
function ReadJson(path: string): unknown {
  try {
    return JSON.parse(Fs.readFileSync(path, 'utf8'))
  } catch (error) {
    throw new Error(`Failed to read or parse ${path}`, { cause: error })
  }
}
// ------------------------------------------------------------------
// EnumerateJson
// ------------------------------------------------------------------
function* EnumerateJson(path: string): Generator<[string, unknown]> {
  const info = Fs.statSync(path)
  if (info.isFile()) {
    if (path.endsWith('.json')) yield [path, ReadJson(path)]
    return
  }
  if (!info.isDirectory()) return
  for (const entry of Fs.readdirSync(path, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
    const filePath = Path.join(path, entry.name)
    if (entry.isDirectory()) {
      yield* EnumerateJson(filePath)
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      yield [filePath, ReadJson(filePath)]
    }
  }
}
// ------------------------------------------------------------------
// EnumerateTests
// ------------------------------------------------------------------
function* EnumerateTests(directory: string, draft: string): Generator<Test> {
  for (const [path, value] of EnumerateJson(directory)) {
    if (!IsDocument(value)) throw new Error(`Invalid JSON Schema test document: ${path}`)
    const filename = Path.relative(directory, path)
    for (const section of [...value].reverse()) {
      if (!Model.IsCompatible(section.compatibility, draft)) continue
      for (const test of [...section.tests].reverse()) {
        yield {
          filename,
          context: section.description,
          externalSchemas: section.externalSchemas,
          schema: section.schema as Schema.XSchema,
          description: test.description,
          data: test.data,
          valid: test.valid
        }
      }
    }
  }
}
// ------------------------------------------------------------------
// FormatExample
// ------------------------------------------------------------------
function FormatExample(name: string, schema: string, data: string): string {
  switch (name) {
    case 'Schema.Build':
      return `const R = Schema.Build(${schema}).Evaluate().Check(${data})`
    case 'Schema.Check':
      return `const R = Schema.Check(${schema}, ${data})`
    case 'Schema.Error':
    case 'Schema.Errors':
      return `const R = Schema.Errors(${schema}, ${data})`
    default:
      return `const R = ${name}(${schema}, ${data})`
  }
}
// ------------------------------------------------------------------
// FormatMessage
// ------------------------------------------------------------------
function FormatMessage(example: string, description: string, valid: boolean, result: boolean): string {
  return `\n\n// ${description} | expect: ${valid}, actual: ${result}\n${example}\n\n`
}
// ------------------------------------------------------------------
// FormatThrow
// ------------------------------------------------------------------
function FormatThrow(example: string, description: string): string {
  return `\n\n// ${description}\n${example}\n\n`
}
// ------------------------------------------------------------------
// AssertThrow
// ------------------------------------------------------------------
function AssertThrow(name: string, test: Test, error: unknown): never {
  const schema = JSON.stringify(test.schema, null, 2)
  const data = JSON.stringify(test.data, null, 2)
  const example = FormatExample(name, schema, data)
  const message = `${error instanceof Error ? error.message : String(error)}${FormatThrow(example, test.description)}`
  throw new Error(message)
}
// ------------------------------------------------------------------
// AssertResult
// ------------------------------------------------------------------
function AssertResult(name: string, test: Test, result: boolean): void {
  if (result === test.valid) return
  const schema = JSON.stringify(test.schema, null, 2)
  const data = JSON.stringify(test.data, null, 2)
  const example = FormatExample(name, schema, data)
  throw new Error(FormatMessage(example, test.description, test.valid, result))
}
// ------------------------------------------------------------------
// Spec
// ------------------------------------------------------------------
export function Spec(name: string, callback: SpecCallback): void {
  const Test = Assert.Context(name)
  for (const draft of Model.Dialects) {
    for (const test of EnumerateTests(TEST_DIRECTORY, draft.id)) {
      Test(`${DRAFT_LABELS[draft.id]} ${test.filename}: ${test.context}: ${test.description}`, () => {
        let result: boolean
        const externalSchemas = Guard.IsUndefined(test.externalSchemas) ? {} : test.externalSchemas
        const testContext = { ...Schema.Meta, ...externalSchemas }
        try {
          result = callback(testContext, test.schema, test.data)
        } catch (error) {
          AssertThrow(name, test, error)
        }
        AssertResult(name, test, result)
      })
    }
  }
}

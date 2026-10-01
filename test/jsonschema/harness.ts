import * as Path from 'node:path'
import { Meta, type XSchema } from 'typebox/schema'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Drafts
// ------------------------------------------------------------------
const drafts = [
  ['draft-3', 'test/jsonschema/cases/draft3'],
  ['draft-4', 'test/jsonschema/cases/draft4'],
  ['draft-6', 'test/jsonschema/cases/draft6'],
  ['draft-7', 'test/jsonschema/cases/draft7'],
  ['draft-2019', 'test/jsonschema/cases/draft2019-09'],
  ['draft-2020', 'test/jsonschema/cases/draft2020-12'],
  ['v1', 'test/jsonschema/cases/v1']
] as const
// ------------------------------------------------------------------
// EnumerateJson
// ------------------------------------------------------------------
export function* enumerateJson(path: string): Generator<[string, unknown]> {
  try {
    const fileInfo = Deno.statSync(path)
    if (fileInfo.isFile) {
      if (path.endsWith('.json') && !Path.basename(path).startsWith('_')) {
        try {
          const content = Deno.readTextFileSync(path)
          yield [path, JSON.parse(content)]
        } catch (error) {
          console.error(`Failed to read or parse ${path}:`, error)
        }
      }
    } else if (fileInfo.isDirectory) {
      for (const entry of Deno.readDirSync(path)) {
        if (entry.name.startsWith('_')) continue
        const filePath = Path.join(path, entry.name)
        if (entry.isFile && entry.name.endsWith('.json')) {
          try {
            const content = Deno.readTextFileSync(filePath)
            yield [filePath, JSON.parse(content)]
          } catch (error) {
            console.error(`Failed to read or parse ${filePath}:`, error)
          }
        } else if (entry.isDirectory) {
          yield* enumerateJson(filePath)
        }
      }
    }
  } catch (error) {
    console.error(`Error accessing ${path}:`, error)
  }
}
// ------------------------------------------------------------------
// EnumerateDocuments
// ------------------------------------------------------------------
type Document = Section[]

interface Section {
  description: string
  schema: object | boolean
  tests: {
    description: string
    data: unknown
    valid: boolean
  }[]
}
function IsDocument(value: unknown): value is Document {
  return Array.isArray(value) && value.every((value) =>
    typeof value === 'object' && value !== null &&
    'description' in value && typeof value.description === 'string' &&
    'schema' in value && (
      (typeof value.schema === 'object' && value.schema !== null) ||
      (typeof value.schema === 'boolean')
    ) &&
    'tests' in value && Array.isArray(value.tests) &&
    value.tests.every((value: unknown) =>
      typeof value === 'object' && value !== null &&
      'description' in value && typeof value.description === 'string' &&
      'data' in value &&
      'valid' in value && typeof value.valid === 'boolean'
    )
  )
}
function* enumerateDocuments(directory: string): Generator<[string, Document]> {
  for (const [filename, document] of enumerateJson(directory)) {
    if (IsDocument(document)) {
      yield [filename, document]
    } else {
      console.log(filename)
    }
  }
}
// ------------------------------------------------------------------
// EnumerateTests
// ------------------------------------------------------------------
export interface Test {
  filename: string
  context: string
  schema: object
  description: string
  data: unknown
  valid: boolean
}
export function* enumerateTests(directory: string): Generator<Test> {
  for (const [path, document] of enumerateDocuments(directory)) {
    const filename = Path.relative(directory, path)
    for (const section of document.reverse()) {
      const context = section.description
      const schema = section.schema as object
      for (const test of section.tests.reverse()) {
        const description = test.description
        const data = test.data
        const valid = test.valid
        yield { filename, context, schema, description, data, valid }
      }
    }
  }
}
// ------------------------------------------------------------------
// Types & Helpers
// ------------------------------------------------------------------
function formatExample(name: string, schemaStr: string, dataStr: string): string {
  switch (name) {
    case 'Schema.Build':
      return `const R = Schema.Build(${schemaStr}).Evaluate().Check(${dataStr})`
    case 'Schema.Check':
      return `const R = Schema.Check(${schemaStr}, ${dataStr})`
    case 'Schema.Error':
    case 'Schema.Errors':
      return `const R = Schema.Errors(${schemaStr}, ${dataStr})`
    case 'Schema.Intern':
      return `const R = Schema.Intern(${schemaStr})\nconst C = Schema.Check(R, ${dataStr})`
    default:
      return `const R = ${name}(${schemaStr}, ${dataStr})`
  }
}
function formatMessage(example: string, description: string, valid: boolean, result: boolean): string {
  const expect = `// ${description} | expect: ${valid}, actual: ${result}`
  return `\n\n${expect}\n${example}\n\n`
}
function formatThrow(example: string, description: string): string {
  const expect = `// ${description}`
  return `\n\n${expect}\n${example}\n\n`
}
function assertThrow(name: string, test: Test, error: unknown): never {
  const schemaStr = JSON.stringify(test.schema, null, 2)
  const dataStr = JSON.stringify(test.data, null, 2)
  const example = formatExample(name, schemaStr, dataStr)
  const errorMessage = error instanceof Error ? error.message : String(error)
  const message = `${errorMessage}${formatThrow(example, test.description)}`
  throw new Error(message)
}
function assertResult(name: string, test: Test, result: boolean): void {
  if (result !== test.valid) {
    const schemaStr = JSON.stringify(test.schema, null, 2)
    const dataStr = JSON.stringify(test.data, null, 2)
    const example = formatExample(name, schemaStr, dataStr)
    const message = formatMessage(example, test.description, test.valid, result)
    throw new Error(message)
  }
}
// ------------------------------------------------------------------
// Spec
// ------------------------------------------------------------------
const remote = JSON.parse(Deno.readTextFileSync('./test/jsonschema/cases/remote.json'))
const context = { ...Meta, ...remote }

type SpecCallback = (context: Record<PropertyKey, XSchema>, schema: XSchema, value: unknown) => boolean

export function Spec(name: string, callback: SpecCallback): void {
  const Test = Assert.Context(name)
  for (const [draft, path] of drafts) {
    for (const test of enumerateTests(path)) {
      Test(`${draft} ${test.filename}: ${test.context}: ${test.description}`, () => {
        let result = false
        try {
          result = callback(context, test.schema as XSchema, test.data)
        } catch (error) {
          assertThrow(name, test, error)
        }
        assertResult(name, test, result)
      })
    }
  }
}

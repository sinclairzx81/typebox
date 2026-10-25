import * as Path from 'node:path'
import * as Fs from 'node:fs'
import * as Schema from 'typebox/schema'
import { Assert } from 'test'

const drafts = [
  ['draft-3', 'test/jsonschema/cases/draft3'],
  ['draft-4', 'test/jsonschema/cases/draft4'],
  ['draft-6', 'test/jsonschema/cases/draft6'],
  ['draft-7', 'test/jsonschema/cases/draft7'],
  ['draft-2019', 'test/jsonschema/cases/draft2019-09'],
  ['draft-2020', 'test/jsonschema/cases/draft2020-12'],
  ['v1', 'test/jsonschema/cases/v1']
] as const

type Section = {
  description: string
  schema: object | boolean
  tests: {
    description: string
    data: unknown
    valid: boolean
  }[]
}
type Document = Section[]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isDocument(value: unknown): value is Document {
  return Array.isArray(value) && value.every((section) =>
    isRecord(section) &&
    typeof section.description === 'string' &&
    (isRecord(section.schema) || typeof section.schema === 'boolean') &&
    Array.isArray(section.tests) &&
    section.tests.every((test) =>
      isRecord(test) &&
      typeof test.description === 'string' &&
      'data' in test &&
      typeof test.valid === 'boolean'
    )
  )
}

function readJson(path: string): unknown {
  try {
    return JSON.parse(Fs.readFileSync(path, 'utf8'))
  } catch (error) {
    throw new Error(`Failed to read or parse ${path}`, { cause: error })
  }
}

export function* enumerateJson(path: string): Generator<[string, unknown]> {
  const info = Fs.statSync(path)
  if (info.isFile()) {
    if (path.endsWith('.json') && !Path.basename(path).startsWith('_')) {
      yield [path, readJson(path)]
    }
    return
  }
  if (!info.isDirectory()) return
  for (const entry of Fs.readdirSync(path, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.name.startsWith('_')) continue
    const filePath = Path.join(path, entry.name)
    if (entry.isDirectory()) {
      yield* enumerateJson(filePath)
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      yield [filePath, readJson(filePath)]
    }
  }
}

interface Test {
  filename: string
  context: string
  schema: Schema.XSchema
  description: string
  data: unknown
  valid: boolean
}

function* enumerateTests(directory: string): Generator<Test> {
  for (const [path, value] of enumerateJson(directory)) {
    if (!isDocument(value)) throw new Error(`Invalid JSON Schema test document: ${path}`)
    const filename = Path.relative(directory, path)
    for (const section of [...value].reverse()) {
      for (const test of [...section.tests].reverse()) {
        yield {
          filename,
          context: section.description,
          schema: section.schema as Schema.XSchema,
          description: test.description,
          data: test.data,
          valid: test.valid
        }
      }
    }
  }
}

function formatExample(name: string, schema: string, data: string): string {
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

function formatMessage(example: string, description: string, valid: boolean, result: boolean): string {
  return `\n\n// ${description} | expect: ${valid}, actual: ${result}\n${example}\n\n`
}

function formatThrow(example: string, description: string): string {
  return `\n\n// ${description}\n${example}\n\n`
}

function assertThrow(name: string, test: Test, error: unknown): never {
  const schema = JSON.stringify(test.schema, null, 2)
  const data = JSON.stringify(test.data, null, 2)
  const example = formatExample(name, schema, data)
  const message = `${error instanceof Error ? error.message : String(error)}${formatThrow(example, test.description)}`
  throw new Error(message)
}

function assertResult(name: string, test: Test, result: boolean): void {
  if (result === test.valid) return
  const schema = JSON.stringify(test.schema, null, 2)
  const data = JSON.stringify(test.data, null, 2)
  const example = formatExample(name, schema, data)
  throw new Error(formatMessage(example, test.description, test.valid, result))
}

const remote = JSON.parse(Fs.readFileSync('./test/jsonschema/cases/remote.json', 'utf8')) as Record<string, Schema.XSchema>
const context = { ...Schema.Meta, ...remote }

type SpecResult = boolean | Promise<boolean>
type SpecCallback = (context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XSchema, value: unknown) => SpecResult

export function Spec(name: string, callback: SpecCallback): void {
  const Test = Assert.Context(name)
  for (const [draft, path] of drafts) {
    for (const test of enumerateTests(path)) {
      Test(`${draft} ${test.filename}: ${test.context}: ${test.description}`, () => {
        let result: SpecResult
        try {
          result = callback(context, test.schema, test.data)
        } catch (error) {
          assertThrow(name, test, error)
        }
        if (result instanceof Promise) {
          return result.then(
            (value) => assertResult(name, test, value),
            (error) => assertThrow(name, test, error)
          )
        }
        assertResult(name, test, result)
      })
    }
  }
}
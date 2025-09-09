import * as Path from 'node:path'

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

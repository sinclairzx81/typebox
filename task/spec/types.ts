/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

export interface JSONSchemaTestGroup {
  description: string
  schema: Record<string, unknown> | boolean
  tests: JSONSchemaTestCase[]
}

export interface JSONSchemaTestCase {
  description: string
  data: unknown
  valid: boolean
}

// A single file to be written — either a passing or failing file.
// Failing files are _-prefixed, e.g. "draft7/_additionalProperties.json"
export interface JSONSchemaTestFile {
  path: string // absolute path to write to
  draft: string // e.g. "draft7"
  keyword: string // e.g. "additionalProperties" or "optional/formats/email"
  failing: boolean // true if this is a _-prefixed failing file
  groups: JSONSchemaTestGroup[]
}
export interface JSONSchemaTestSuite {
  files: JSONSchemaTestFile[]
  report: {
    // key is "<draft>/<keyword>", e.g. "draft7/optional/formats/email"
    // split on first "/" to get draft, join the rest for keyword
    [path: string]: {
      passed: number
      failed: number
      total: number
    }
  }
}

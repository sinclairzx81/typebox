/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

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

import * as Schema from 'typebox/schema'
import { Segment } from './segment.ts'

// ------------------------------------------------------------------
// Upgrade
// ------------------------------------------------------------------
export async function Upgrade(): Promise<void> {
  const report = await Segment((_draft, externalSchemas, schema, value) => {
    const testContext = { ...Schema.Meta, ...externalSchemas }
    const build = Schema.Compile(testContext, schema).Check(value)
    const check = Schema.Check(testContext, schema, value)
    const errors = Schema.Errors(testContext, schema, value)[0]
    const consistent = build === check && check === errors
    if (!consistent) throw new Error(`Inconsistent validation results: compile=${build}, check=${check}, errors=${errors}`)
    return check
  }, {
    cloneDirectory: 'target/json-schema-test-suite',
    segmentedDirectory: 'test/jsonschema/cases'
  })
  console.log('')
  console.log('## Required Keywords')
  console.log('')
  console.log(report.required)
  console.log('')
  console.log('## Optional Keywords and Proposals')
  console.log('')
  console.log(report.optional)
  console.log('')
  console.log(report.drafts)
  console.log(report.total)
}

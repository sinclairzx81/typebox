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

// deno-fmt-ignore-file

import { Task } from 'tasksmith'
import * as Schema from 'typebox/schema'
import * as Process from './process.ts'
import * as Report from './report.ts'
import type { JSONSchemaTestSuite } from './types.ts'
import { Folder } from 'https://raw.githubusercontent.com/sinclairzx81/tasksmith/0.9.9/src/build/dual/folder.ts'

// ------------------------------------------------------------------
// Clone
// ------------------------------------------------------------------
const CLONE_DIRECTORY = 'spec-clone-directory'

// ------------------------------------------------------------------
// Clone
// ------------------------------------------------------------------
async function clone() {
  await Task.folder(CLONE_DIRECTORY).delete()
  await Task.folder(CLONE_DIRECTORY).create()
  await Task.shell(`cd ${CLONE_DIRECTORY} && git clone git@github.com:json-schema-org/JSON-Schema-Test-Suite.git`)
}
// ------------------------------------------------------------------
// Process
// ------------------------------------------------------------------
function process(): JSONSchemaTestSuite {
  return Process.process(`${CLONE_DIRECTORY}/JSON-Schema-Test-Suite/tests`, (_draft, schema, value) => {
    const build = Schema.Compile(schema).Check(value)
    const check = Schema.Check(schema, value)
    const error = Schema.Errors(schema, value)[0]
    const consistent = (check === build) && (check === error)
    if(!consistent) return null
    return check
  })
}
// ------------------------------------------------------------------
// Report
// ------------------------------------------------------------------
function report(suite: JSONSchemaTestSuite): void {
  const requiredTable = Report.reportRequired(suite, {
    ignore: ['defs', 'definitions', 'divisibleBy', 'disallow', 'dynamicRef', 'extends', 'format', 'refRemote', 'vocabulary']
  })
  console.log('')
  console.log('## Required Keywords')
  console.log('')
  console.log(requiredTable)
  console.log('')
  const optionalTable = Report.reportOptional(suite, {
    ignore: []
  })
  console.log('## Optional Keywords and Proposals')
  console.log('')
  console.log(optionalTable)
}
// ------------------------------------------------------------------
// Write
// ------------------------------------------------------------------
async function write(directory: string, suite: JSONSchemaTestSuite): Promise<void> {
  await Task.folder(directory).delete()
  for(const file of suite.files) {
    const path = `${directory}/${file.path}`
    const content = JSON.stringify(file.groups, null, 2)
    await Task.file(path).write(content)
  }
}
async function cleanup(): Promise<void> {
  await Task.folder(CLONE_DIRECTORY).delete()
}
// ------------------------------------------------------------------
// Refresh
// ------------------------------------------------------------------
/** Refresh the test suite with the latest cases */
export async function refresh(directory: string): Promise<void> {
  await clone()
  const suite = process()
  await report(suite)
  await write(directory, suite)
  await cleanup()
}





